import { addLoaderError, setLoaderStatus } from '../ui/loader'
import { log } from '../utils/tools'
import { validate } from '../utils/validate'

import type { LoadedMod } from './mod'
import type {
	Method,
	MethodPatchTypes,
	PatchableClassMap,
	PatchContext,
	PatchSpec
} from '../../types/modloader'
import type { Schema } from '../utils/validate'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor = abstract new (...args: any) => any

// less strict, better for dynamic access, but allows arbitrary keys, so only used internally
interface InternalPatchableClassMap
	extends PatchableClassMap,
		Record<string, Constructor> {}

export type PatchCollection = {
	[ClassName in keyof InternalPatchableClassMap]?: ClassPatchCollection<
		InstanceType<InternalPatchableClassMap[ClassName]>
	>
}

export type ClassPatchCollection<T extends object> = {
	methods: {
		[MethodName in keyof T]?: T[MethodName] extends Method
			? MethodPatchCollection<T, T[MethodName]>
			: never
	}
}

export type MethodPatchCollection<T, M extends Method> = {
	[K in keyof MethodPatchTypes<T, M>]: {
		mod: string
		patch: MethodPatchTypes<T, M>[K]
	}[]
}

const _METHOD_PATCH_SCHEMA: Schema = {
	type: 'object',
	extra: {
		all: { type: 'function' }
	}
}

const PATCH_SPEC_SCHEMA: Schema = {
	type: 'object',
	extra: {
		all: {
			type: 'object',
			properties: {
				new: { type: 'function' },
				replace: _METHOD_PATCH_SCHEMA,
				wrap: _METHOD_PATCH_SCHEMA,
				observe: _METHOD_PATCH_SCHEMA
			}
		}
	}
}

const METHOD_PATCH_GROUPS = ['replace', 'wrap', 'observe'] as const

export function collectPatches(mods: LoadedMod[]): PatchCollection {
	setLoaderStatus('Collecting mod patches')
	const collection: PatchCollection = {}

	for (const mod of mods) {
		if (!mod.definition.getPatches) continue

		try {
			mod.patches = mod.definition.getPatches(mod.mctx)
		} catch (e) {
			addLoaderError({
				source: 'external',
				severity: 'error',
				summary: `An error occured while processing patches for mod "${mod.definition.name}"`,
				details: [e instanceof Error ? e.message : String(e)]
			})
			continue
		}

		const errors = validate(PATCH_SPEC_SCHEMA, mod.patches)
		if (errors.length > 0) {
			log(errors)
			continue
		}

		addModPatches(collection, mod.definition.name, mod.patches)
	}

	detectConflicts(collection)

	return collection
}

export function addModPatches(
	collection: PatchCollection,
	modName: string,
	patches: PatchSpec
) {
	for (const className of Object.keys(patches) as (keyof PatchableClassMap)[]) {
		const classPatch = patches[className]
		if (classPatch === undefined) continue

		const classPatchCollection = (collection[className] ??= { methods: {} })

		for (const groupName of METHOD_PATCH_GROUPS) {
			const patchGroup = classPatch[groupName]
			if (patchGroup === undefined) continue

			for (const methodName of Object.keys(patchGroup)) {
				// @ts-expect-error: keys of patchGroup directly translate to keys of the 'methods' field of the collection for the same class
				const methodPatchCollection = (classPatchCollection.methods[
					methodName
				] ??= {
					replace: [],
					wrap: [],
					observe: []
				}) as MethodPatchCollection<
					InstanceType<InternalPatchableClassMap[keyof PatchableClassMap]>,
					Method
				>

				methodPatchCollection[groupName].push({
					mod: modName,
					patch: patchGroup[methodName as keyof typeof patchGroup]
				})
			}
		}
	}
}

function detectConflicts(collection: PatchCollection) {
	for (const className in collection) {
		const classMethodsCollection = collection[className]?.methods ?? {}

		for (const methodName in classMethodsCollection) {
			const methodPatchCollection = classMethodsCollection[methodName]
			if (
				methodPatchCollection === undefined ||
				methodPatchCollection.replace.length <= 1
			) {
				continue
			}

			addLoaderError({
				source: 'external',
				severity: 'warning',
				summary: `Multiple mods are in conflict patching "${className}.${methodName}", and only the first one will work properly.`,
				details: methodPatchCollection.replace.map(entry => entry.mod)
			})
		}
	}
}

export function applyPatches(
	patches: PatchCollection,
	patchableClassMap: InternalPatchableClassMap
) {
	setLoaderStatus('Applying mod patches')

	for (const className in patches) {
		const classPatch = patches[className]
		if (classPatch === undefined) continue

		const patchableClass = patchableClassMap[className]
		const shouldBePresent = className in patchableClassMap
		const isPresent = patchableClass !== undefined

		if (!shouldBePresent || !isPresent) {
			const modNamesSet = new Set<string>()
			Object.values(classPatch.methods).forEach(method => {
				if (method !== undefined) {
					Object.values(method).forEach(group =>
						group.forEach(entry => modNamesSet.add(entry.mod))
					)
				}
			})
			const modNames = Array.from(modNamesSet)

			const summary = shouldBePresent
				? `An expected class "${className}" patched by mods is missing at runtime.`
				: `Mods tried to patch an invalid class "${className}".`

			addLoaderError({
				source: 'external',
				severity: 'error',
				summary,
				details: modNames
			})

			continue
		}

		for (const methodName in classPatch.methods) {
			const methodPatch = classPatch.methods[methodName]
			if (methodPatch === undefined) continue

			const handler = composeMethodPatches(
				methodPatch,
				`${className}.${methodName}`
			)

			patchableClass.prototype[methodName] = new Proxy(
				patchableClass.prototype[methodName],
				handler
			)
		}
	}
}

type ChainContext<T, M extends Method> = PatchContext<T, M> & {
	pointer: number
	counter: number
}
type PatchChain<T, M extends Method> = (
	ctx: ChainContext<T, M>,
	...args: Parameters<M>
) => ReturnType<M>

function composeMethodPatches<T, M extends Method>(
	methodPatchCollection: MethodPatchCollection<T, M>,
	targetId: string
): ProxyHandler<M> {
	const wraps = methodPatchCollection.wrap
	const observers = methodPatchCollection.observe
	const replace =
		methodPatchCollection.replace?.length > 0
			? methodPatchCollection.replace[0]
			: undefined

	const expectedCounter = wraps.length
	const sourceStack = [...wraps.map(w => w.mod), replace ? replace.mod : 'game']

	const final: PatchChain<T, M> = replace
		? (ctx, ...args) => replace.patch({ self: ctx.self }, ...args)
		: (ctx, ...args) => ctx.original.apply(ctx.self, args)

	const composite =
		wraps.length === 0
			? final
			: wraps
					.map(w => w.patch)
					.reduceRight(
						(next, wrap) =>
							(ctx, ...args) =>
								wrap(
									{
										self: ctx.self,
										original: ((...args: Parameters<M>) => {
											ctx.pointer++
											ctx.counter++
											const res = next(ctx, ...args)
											ctx.pointer--
											return res
										}) as M
									},
									...args
								),
						final
					)

	const runComposite = wraps.length > 0 || replace
	const runObservers = observers.length > 0

	return {
		apply(target: M, thisArg: T, argArray: Parameters<M>) {
			let res

			if (runComposite) {
				const ctx: ChainContext<T, M> = {
					self: thisArg,
					original: target,
					pointer: 0,
					counter: 0
				}

				try {
					res = composite(ctx, ...argArray)

					if (ctx.counter !== expectedCounter) {
						contractViolation(sourceStack[ctx.counter], targetId)
					}
				} catch (e) {
					patchError(sourceStack[ctx.pointer], targetId, e)
				}
			} else {
				res = target.apply(thisArg, argArray)
			}

			if (runObservers) {
				let i = 0
				try {
					for (; i < observers.length; i++) {
						observers[i].patch({ self: thisArg }, res, ...argArray)
					}
				} catch (e) {
					patchError(observers[i].mod, targetId, e)
				}
			}

			return res
		}
	}
}

// these are temporary implementations, I will do better later

function patchError(who: string, where: string, what: unknown) {
	console.log(`[CONTRACT VIOLATION] ${who} (at ${where}):`, what)
}

function contractViolation(who: string, where: string) {
	console.log(`[CONTRACT VIOLATION] ${who} (at ${where})`)
}

export function getPatchableClasses(): InternalPatchableClassMap {
	return {
		Bezier: Bezier,
		VFX: VFX,
		Exhaust: Exhaust,
		ResourceExplosion: ResourceExplosion,
		ResourceSpark: ResourceSpark,
		ScannerMap: ScannerMap,
		Impact: Impact,
		ResourceTransfer: ResourceTransfer,
		ChasmTransfer: ChasmTransfer,
		Lightning: Lightning,
		DarkWave: DarkWave,
		Game: Game,
		Sprite: Sprite,
		Entity: Entity,
		Strange: Strange,
		Strange1: Strange1,
		Strange2: Strange2,
		Strange3: Strange3,
		Vault: Vault,
		Doublechannel: Doublechannel,
		Consumer: Consumer,
		Preheater: Preheater,
		Doublechannel2: Doublechannel2,
		Auxpump: Auxpump,
		Auxpump2: Auxpump2,
		Valve: Valve,
		Injector: Injector,
		Entropic: Entropic,
		Entropic2: Entropic2,
		Entropic2a: Entropic2a,
		Entropic3: Entropic3,
		Destabilizer: Destabilizer,
		Destabilizer2: Destabilizer2,
		Destabilizer2a: Destabilizer2a,
		Converter32: Converter32,
		Converter13: Converter13,
		Converter41: Converter41,
		Converter76: Converter76,
		Converter64: Converter64,
		Reflector: Reflector,
		Generaldecay: Generaldecay,
		Cube: Cube,
		Pump: Pump,
		Pump2: Pump2,
		Mega1: Mega1,
		Mega1a: Mega1a,
		Mega1b: Mega1b,
		Mega2: Mega2,
		Mega3: Mega3,
		Eye: Eye,
		Clicker1: Clicker1,
		Clicker2: Clicker2,
		Clicker3: Clicker3,
		Cookie: Cookie,
		Pinhole: Pinhole,
		Gradient: Gradient,
		Chasm: Chasm,
		Conductor: Conductor,
		Voidsculpture: Voidsculpture,
		Hollow: Hollow,
		Flower: Flower,
		Fruit: Fruit,
		Vessel: Vessel,
		Vessel2: Vessel2,
		Silo: Silo,
		Silo2: Silo2,
		Waypoint: Waypoint,
		Waypoint2: Waypoint2,
		Annihilator: Annihilator,
		Surge: Surge,
		Stabilizer: Stabilizer,
		Stabilizer2: Stabilizer2,
		Stabilizer3: Stabilizer3,
		Scan: Scan,
		Puncture: Puncture,
		Achiever: Achiever,
		Messenger: Messenger,
		Splash: Splash,
		Cloud: Cloud,
		Shop: Shop,
		Explainer: Explainer
	}
}
