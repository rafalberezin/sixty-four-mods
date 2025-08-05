import type { Codex } from './game'

export {}

export type LogFunction = (...args: unknown[]) => void
export interface ModLogger {
	log: LogFunction
}

export type ModToolbox = Readonly<{
	inModsDir(target: string): string
	newModLogger(namespace: string): ModLogger
	focusesTextEditableElement(): boolean
	sanitizers: Readonly<{
		nonNegative: SettingSanitizer<'number'>
		colorHexRGB: SettingSanitizer<'string'>
		colorHexRGBA: SettingSanitizer<'string'>
	}>
}>

declare global {
	const MOD_TOOLBOX: ModToolbox
}

export interface Mod<S extends ModSettingsDefinition = ModSettingsDefinition> {
	id: string
	name: string
	description: string

	version: string
	gameVersion: string
	loaderVersion: string

	settings?: S

	getPatches?: (mctx: ModContext<S>) => PatchSpec
	updateCodex?: (mctx: ModContext<S>, codex: Codex) => void
	getStyles?: (mctx: ModContext<S>) => string
	onLoad?: (mctx: ModContext<S>) => void
}

export type ModSettingsDefinition = Record<string, SettingUnion>

type SettingUnion = {
	[K in keyof SettingTypes]: ModSettingsDefinitionEntry<K>
}[keyof SettingTypes]

export interface SettingTypes {
	string: string
	number: number
	boolean: boolean
}

export interface ModSettingsDefinitionEntry<T extends keyof SettingTypes> {
	type: T
	name: string
	description?: string
	default: SettingTypes[T]
	sanitize: SettingSanitizer<T>
}

export type SettingSanitizer<T extends keyof SettingTypes> = (
	val: SettingTypes[T],
	defaultVal: SettingTypes[T]
) => SettingTypes[T]

export type ModSettings<
	S extends ModSettingsDefinition = ModSettingsDefinition
> = {
	[K in keyof S]: Readonly<{
		type: S[K]['type']
		value: SettingTypes[S[K]['type']]
	}>
}

export type ModContext<S extends ModSettingsDefinition> = Readonly<{
	settings: Readonly<ModSettings<S>>
}>

export type PatchSpec = {
	[K in keyof PatchableClassMap]?: PatchFor<InstanceType<PatchableClassMap[K]>>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Method = (...args: any) => any

// Patch function signatures inlined for better type hints
export type PatchFor<T extends object> = {
	replace?: {
		[K in keyof T as T[K] extends Method ? K : never]?: T[K] extends Method
			? (ctx: SelfContext<T>, ...args: Parameters<T[K]>) => ReturnType<T[K]>
			: never
	}
	/** @remarks You MUST call the ctx.original during your patch execution */
	wrap?: {
		[K in keyof T as T[K] extends Method ? K : never]?: T[K] extends Method
			? (
					ctx: PatchContext<T, T[K]>,
					...args: Parameters<T[K]>
				) => ReturnType<T[K]>
			: never
	}
	observe?: {
		[K in keyof T as T[K] extends Method ? K : never]?: T[K] extends Method
			? (
					ctx: SelfContext<T>,
					returnVal: ReturnType<T[K]> | undefined,
					...args: Parameters<T[K]>
				) => void
			: never
	}
}

export type MethodPatchTypes<T, M extends Method> = {
	replace: ReplacePatch<T, M>
	wrap: WrapPatch<T, M>
	observe: ObservePatch<T, M>
}

export type ReplacePatch<T, M extends Method> = (
	ctx: SelfContext<T>,
	...args: Parameters<M>
) => ReturnType<M>

export type WrapPatch<T, M extends Method> = (
	ctx: PatchContext<T, M>,
	...args: Parameters<M>
) => ReturnType<M>

export type ObservePatch<T, M extends Method> = (
	ctx: SelfContext<T>,
	returnVal: ReturnType<M> | undefined,
	...args: Parameters<M>
) => void

export interface PatchContext<T, M extends Method> extends SelfContext<T> {
	/** @remarks You MUST call the ctx.original during your patch execution */
	readonly original: M
}

export type SelfContext<T> = {
	readonly self: T
}

export interface PatchableClassMap {
	Bezier: typeof Bezier

	VFX: typeof VFX
	Exhaust: typeof Exhaust
	ResourceExplosion: typeof ResourceExplosion
	ResourceSpark: typeof ResourceSpark
	ScannerMap: typeof ScannerMap
	Impact: typeof Impact
	ResourceTransfer: typeof ResourceTransfer
	ChasmTransfer: typeof ChasmTransfer
	Lightning: typeof Lightning
	DarkWave: typeof DarkWave

	Game: typeof Game
	Sprite: typeof Sprite

	Entity: typeof Entity
	Strange: typeof Strange
	Strange1: typeof Strange1
	Strange2: typeof Strange2
	Strange3: typeof Strange3
	Vault: typeof Vault
	Doublechannel: typeof Doublechannel
	Consumer: typeof Consumer
	Preheater: typeof Preheater
	Doublechannel2: typeof Doublechannel2
	Auxpump: typeof Auxpump
	Auxpump2: typeof Auxpump2
	Valve: typeof Valve
	Injector: typeof Injector
	Entropic: typeof Entropic
	Entropic2: typeof Entropic2
	Entropic2a: typeof Entropic2a
	Entropic3: typeof Entropic3
	Destabilizer: typeof Destabilizer
	Destabilizer2: typeof Destabilizer2
	Destabilizer2a: typeof Destabilizer2a
	Converter32: typeof Converter32
	Converter13: typeof Converter13
	Converter41: typeof Converter41
	Converter76: typeof Converter76
	Converter64: typeof Converter64
	Reflector: typeof Reflector
	Generaldecay: typeof Generaldecay
	Cube: typeof Cube
	Pump: typeof Pump
	Pump2: typeof Pump2
	Mega1: typeof Mega1
	Mega1a: typeof Mega1a
	Mega1b: typeof Mega1b
	Mega2: typeof Mega2
	Mega3: typeof Mega3
	Eye: typeof Eye
	Clicker1: typeof Clicker1
	Clicker2: typeof Clicker2
	Clicker3: typeof Clicker3
	Cookie: typeof Cookie
	Pinhole: typeof Pinhole
	Gradient: typeof Gradient
	Chasm: typeof Chasm
	Conductor: typeof Conductor
	Voidsculpture: typeof Voidsculpture
	Hollow: typeof Hollow
	Flower: typeof Flower
	Fruit: typeof Fruit
	Vessel: typeof Vessel
	Vessel2: typeof Vessel2
	Silo: typeof Silo
	Silo2: typeof Silo2
	Waypoint: typeof Waypoint
	Waypoint2: typeof Waypoint2
	Annihilator: typeof Annihilator
	Surge: typeof Surge
	Stabilizer: typeof Stabilizer
	Stabilizer2: typeof Stabilizer2
	Stabilizer3: typeof Stabilizer3
	Scan: typeof Scan
	Puncture: typeof Puncture

	Achiever: typeof Achiever
	Messenger: typeof Messenger
	Splash: typeof Splash
	Cloud: typeof Cloud
	Shop: typeof Shop
	Explainer: typeof Explainer
}
