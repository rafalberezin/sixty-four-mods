import fs from 'fs'
import path from 'path'

import { addLoaderError, setLoaderStatus } from '../ui/loader'
import { deepFreeze } from '../utils/tools'
import { validate } from '../utils/validate'
import {
	isCompatibleVersion,
	isVersionString,
	VERSIONS,
	versionFromString
} from '../utils/version'

import type { LoaderSettings } from './settings'
import type {
	Mod,
	ModSettings,
	ModSettingsDefinitionEntry,
	SettingTypes,
	ModContext,
	ModSettingsDefinition,
	PatchSpec
} from '../types/modloader'
import type { Schema } from '../utils/validate'
import type { Version } from '../utils/version'

export interface LoadedMod {
	definition: Mod
	enabled: boolean

	settings?: ModSettings<ModSettingsDefinition>
	mctx: ModContext<ModSettingsDefinition>

	patches?: PatchSpec
	styles?: string
}

export async function loadMods(
	modsDir: string,
	settings: LoaderSettings,
	gameVersion: Version | undefined
): Promise<LoadedMod[]> {
	setLoaderStatus('Loading mods')
	const rawMods = await loadRawMods(modsDir)

	setLoaderStatus('Initializing mods')
	const mods: LoadedMod[] = []
	for (const rawMod of rawMods) {
		const modConfig = (settings.mods[rawMod.id] ??= {
			enabled: true,
			settings: {}
		})

		const mod: LoadedMod = {
			definition: deepFreeze(rawMod),
			enabled: modConfig.enabled,
			mctx: deepFreeze({ settings: {} })
		}

		verifyModVersions(rawMod, gameVersion)

		if (rawMod.settings) {
			const settings = loadModSettings(rawMod, modConfig.settings)
			mod.settings = deepFreeze(settings)
			mod.mctx = Object.freeze({ settings })
		}

		mods.push(mod)
	}

	return mods
}

async function loadRawMods(modsDir: string): Promise<Mod[]> {
	setLoaderStatus('Loading mod files')

	if (!fs.existsSync(modsDir)) {
		fs.mkdirSync(modsDir)
		return []
	}

	const modFiles = fs
		.readdirSync(modsDir)
		.sort()
		.filter(name => name.endsWith('.js'))
		.map(name => ({
			name,
			path: path.join(modsDir, name)
		}))
		.filter(file => fs.statSync(file.path).isFile())

	const rawMods: { file: string; mod: Mod }[] = []

	for (const modFile of modFiles) {
		setLoaderStatus(`Loading mod file "${modFile.name}"`)

		let mod
		try {
			const rawMod = await import(modFile.path)
			mod = rawMod.default
		} catch (e) {
			addLoaderError({
				source: 'external',
				severity: 'error',
				summary: `Could not load file "${modFile.name}"`,
				details: [e instanceof Error ? e.message : String(e)]
			})

			continue
		}

		setLoaderStatus(`Validating mod file "${modFile.name}"`)
		const errors = validate(MOD_SCHEMA, mod)
		if (errors.length !== 0) {
			addLoaderError({
				source: 'external',
				severity: 'error',
				summary: `Invalid mod definition in file "${modFile.name}"`,
				details: errors
			})

			continue
		}

		rawMods.push({ mod, file: modFile.name })
	}

	return filterUniqueIds(rawMods)
}

const MOD_VERSION_FIELDS = ['version', 'gameVersion', 'loaderVersion'] as const
const MOD_SCHEMA: Schema = {
	type: 'object',
	required: ['id', 'name', 'description', ...MOD_VERSION_FIELDS],
	extra: {
		self(value, path) {
			return MOD_VERSION_FIELDS.filter(
				key => typeof value[key] !== 'string' || !isVersionString(value[key])
			).map(key => `${path}.${key}: Expected a version string`)
		}
	},
	properties: {
		id: { type: 'string' },
		name: { type: 'string' },
		description: { type: 'string' },
		...Object.fromEntries(
			MOD_VERSION_FIELDS.map(key => [key, { type: 'string' }])
		),
		getPatches: { type: 'function' },
		updateCodex: { type: 'function' },
		updateWords: { type: 'function' },
		getStyles: { type: 'function' },
		onLoad: { type: 'function' },
		settings: {
			type: 'object',
			extra: {
				all: {
					type: 'object',
					required: ['type', 'name', 'default', 'sanitize'],
					properties: {
						type: {
							type: 'exact',
							matches: ['string', 'number', 'boolean'],
							matchesInError: true
						},
						name: { type: 'string' },
						description: { type: 'string' },
						sanitize: { type: 'function' }
					},
					extra: {
						self: (value, path) =>
							typeof value.default !== value.type
								? [`${path}.default: Expected ${value.type}`]
								: []
					}
				}
			}
		}
	}
}

function filterUniqueIds(mods: { mod: Mod; file: string }[]): Mod[] {
	setLoaderStatus('Checking mod id uniqueness')

	const seenIds: Record<string, string> = {}
	const issues: Record<string, string[]> = {}

	for (const mod of mods) {
		const id = mod.mod.id

		if (!(id in seenIds)) {
			seenIds[id] = mod.file
			continue
		}

		;(issues[id] ??= [seenIds[id]]).push(mod.file)
	}

	for (const [id, files] of Object.entries(issues)) {
		addLoaderError({
			source: 'external',
			severity: 'error',
			summary: `Multiple mod files specify the same unique id "${id}"`,
			details: ['These files will not be loaded:', ...files]
		})
	}

	return mods.filter(mod => !(mod.mod.id in issues)).map(mod => mod.mod)
}

function verifyModVersions(rawMod: Mod, gameVersion: Version | undefined) {
	const modLoaderVersion = versionFromString(rawMod.loaderVersion)
	if (
		modLoaderVersion === undefined ||
		!isCompatibleVersion(modLoaderVersion, VERSIONS.loader)
	) {
		addLoaderError({
			source: 'external',
			severity: 'warning',
			summary: `Mod "${rawMod.name}" requires a newer version of the mod loader and might not work properly.`,
			details: [
				`Required loader version: ${rawMod.loaderVersion}`,
				`Current loader version: ${VERSIONS.loader.str}`
			]
		})
	}

	if (gameVersion === undefined) return

	const modGameVersion = versionFromString(rawMod.gameVersion)
	if (
		modGameVersion === undefined ||
		!isCompatibleVersion(modGameVersion, gameVersion, true)
	) {
		addLoaderError({
			source: 'external',
			severity: 'warning',
			summary: `Mod "${rawMod.name}" requires a different game version and might not work properly.`,
			details: [
				`Target game version: ${rawMod.gameVersion}`,
				`Current game version: ${gameVersion.str}`
			]
		})
	}
}

function loadModSettings(mod: Mod, saved: ModSettings): ModSettings {
	if (mod.settings === undefined) return {}

	const settings: ModSettings = {}
	const issues: { id: string; expected: string; received: string }[] = []

	for (const [id, setting] of Object.entries(mod.settings)) {
		const savedSetting = saved[id]
		const savedValue =
			savedSetting?.type === setting.type ? savedSetting.value : setting.default

		let value

		try {
			value = (
				setting as ModSettingsDefinitionEntry<keyof SettingTypes>
			).sanitize(savedValue, setting.default)
		} catch (e) {
			addLoaderError({
				source: 'external',
				severity: 'error',
				summary: `An error occured while sanitizing setting "${id}" for mod "${mod.name}"`,
				details: [e instanceof Error ? e.message : String(e)]
			})

			value = setting.default
		}

		if (typeof value !== setting.type) {
			issues.push({ id, expected: setting.type, received: typeof value })
			value = setting.default
		}

		settings[id] = {
			type: setting.type,
			value
		}
	}

	if (issues.length > 0) {
		addLoaderError({
			source: 'external',
			severity: 'warning',
			summary: `Some setting sanitizers for mod "${mod.name}" returned mismatched types. These settigns were reset to detaults.`,
			details: issues.map(
				issue =>
					`Setting "${issue.id}": expected "${issue.expected}", received: "${issue.received}"`
			)
		})
	}

	return settings
}

export function onLoadMods(mods: LoadedMod[]) {
	for (const mod of mods) {
		try {
			mod.definition.onLoad?.(mod.mctx)
		} catch (e) {
			addLoaderError({
				source: 'external',
				severity: 'error',
				summary: `An error occured while running the "onLoad" hook for mod "${mod.definition.name}"`,
				details: [e instanceof Error ? e.message : String(e)]
			})
		}
	}
}
