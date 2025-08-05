import fs from 'fs'

import { setLoaderStatus } from '../ui/loader'
import { log } from '../utils/tools'
import { validate } from '../utils/validate'

import type { LoadedMod } from './mod'
import type { ModSettings } from '../../types/modloader'
import type { ErrorMessage, Schema } from '../utils/validate'

export interface LoaderSettings {
	format: number
	modloader: {
		unsafe: boolean
		loaderFadeOutDuration: number
	}
	mods: Record<
		string,
		{
			enabled: boolean
			settings: Readonly<ModSettings>
		}
	>
}

const DEFAULT_SETTINGS = {
	format: 1,
	modloader: {
		unsafe: false,
		loaderFadeOutDuration: 1000
	},
	mods: {}
} satisfies LoaderSettings

export const SETTINGS_SCHEMA: Schema = {
	type: 'object',
	required: ['format', 'modloader', 'mods'],
	properties: {
		format: { type: 'exact', matches: [1], matchesInError: true },
		modloader: {
			type: 'object',
			required: ['unsafe', 'loaderFadeOutDuration'],
			properties: {
				unsafe: { type: 'boolean' },
				loaderFadeOutDuration: { type: 'number' }
			}
		},
		mods: {
			type: 'object',
			extra: {
				all: {
					type: 'object',
					required: ['enabled', 'settings'],
					properties: {
						enabled: { type: 'boolean' },
						settings: {
							type: 'object',
							extra: {
								all: {
									type: 'object',
									required: ['type', 'value'],
									properties: {
										type: { type: 'string' }
									},
									extra: {
										self: (value, path) =>
											typeof value.value !== value.type
												? [`${path}.value: Expected ${value.type}`]
												: []
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

export function loadSettings(path: string): {
	settings: LoaderSettings
	errors: ErrorMessage[]
} {
	setLoaderStatus('Loading settings')

	let settings = DEFAULT_SETTINGS

	try {
		if (!fs.existsSync(path)) return { settings, errors: [] }
		if (!fs.statSync(path).isFile()) return { settings, errors: ['Not a file'] }

		const file = fs.readFileSync(path, {
			encoding: 'utf-8'
		})

		settings = JSON.parse(file)
	} catch (e) {
		return {
			settings,
			errors: [e instanceof Error ? e.message : String(e)]
		}
	}

	const errors = validate(SETTINGS_SCHEMA, settings)
	if (errors.length !== 0) {
		return {
			settings: DEFAULT_SETTINGS,
			errors: ['Invalid settings configuration file structure:', ...errors]
		}
	}

	return { settings, errors: [] }
}

export function synchronizeSettingsWithMods(
	settings: LoaderSettings,
	mods: LoadedMod[]
): LoaderSettings {
	const updated: LoaderSettings = {
		format: settings.format,
		modloader: settings.modloader,
		mods: {}
	}

	for (const mod of mods) {
		updated.mods[mod.definition.id] = {
			enabled: mod.enabled,
			settings: mod.settings ?? {}
		}
	}

	return updated
}

export function saveSettings(
	path: string,
	settings: LoaderSettings
): ErrorMessage | null {
	log('Saving settings')

	try {
		const data = JSON.stringify(settings, undefined, '\t')

		fs.writeFileSync(path, data, {
			encoding: 'utf-8'
		})

		return null
	} catch (e) {
		log('Settings configuration file could not be saved:', e)
		return e instanceof Error ? e.message : String(e)
	}
}
