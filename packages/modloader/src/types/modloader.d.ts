export {}

export type MODLOADER_VERSION = '__VERSION__' // populated automatically from `package.json`

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
	updateCodex?: (mctx: ModContext<S>, codex: __Codex__) => void
	updateWords?: (mctx: ModContext<S>, words: __Words__) => void
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
	[K in keyof __PatchableClassMap__]?: PatchFor<
		InstanceType<__PatchableClassMap__[K]>
	>
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
