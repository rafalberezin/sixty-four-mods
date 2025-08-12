/**
 * @license MIT
 * Copyright (c) 2025 Rafał Berezin
 */

import { updateCodex } from './core/codex'
import { loadMods, onLoadMods } from './core/mod'
import { applyPatches, collectPatches, getPatchableClasses } from './core/patch'
import { preloadGameScripts } from './core/preload'
import {
	loadSettings,
	saveSettings,
	synchronizeSettingsWithMods
} from './core/settings'
import {
	addLoaderError,
	finishLoader,
	setLoaderFadeOutDuration,
	initializeLoader,
	setLoaderStatus
} from './ui/loader'
import { initializeUI } from './ui/main'
import { initializeSettings as initializeSettingsMenu } from './ui/settings'
import { initSplashMenu } from './ui/splash'
import { loadStyles } from './ui/style'
import {
	bindDevToolsHook,
	bindToolbox,
	log,
	MOD_TOOLBOX,
	MODS_DIR_PATH
} from './utils/tools'
import {
	isCompatibleVersion,
	extractGameVersion,
	VERSIONS
} from './utils/version'

declare global {
	const game: Game
}

async function main() {
	log('Initializing')

	initializeUI()
	initializeLoader()

	setLoaderStatus('Verifying game and loader versions')
	const gameVersion = extractGameVersion()
	if (gameVersion === undefined) {
		addLoaderError({
			source: 'internal',
			severity: 'warning',
			summary:
				'Mod Loader could not determine the curernt game version.' +
				'Compatibility checks are disabled.',
			details: [
				'Game version detection failed.',
				'Some mods may not be compatible.'
			]
		})
	} else if (!isCompatibleVersion(gameVersion, VERSIONS.gameTarget, true)) {
		addLoaderError({
			source: 'internal',
			severity: 'warning',
			summary:
				'Mod Loader targets a different game version than the one currently running.',
			details: [
				`Detected game version: ${gameVersion.str}`,
				`Targeted version: ${VERSIONS.gameTarget.str}`,
				'Compatibility is not guaranteed. You might want to download matching version of the Mod Loader if available.'
			]
		})
	}

	bindToolbox()
	bindDevToolsHook()

	await preloadGameScripts()

	const settingsPath = MOD_TOOLBOX.inModsDir('../modloader/settings.json')
	const { settings: loadedSettings, errors } = loadSettings(settingsPath)
	if (errors.length > 0) {
		log('Settings configuration file could not be loaded:', errors)
		addLoaderError({
			source: 'internal',
			severity: 'warning',
			summary:
				'Settings configuration file could not be loaded. Defaults were used.',
			details: [...errors]
		})
	}

	setLoaderFadeOutDuration(loadedSettings.modloader.loaderFadeOutDuration)

	const loadedMods = await loadMods(MODS_DIR_PATH, loadedSettings, gameVersion)

	const settings = synchronizeSettingsWithMods(loadedSettings, loadedMods)
	saveSettings(settingsPath, settings)

	const enabledMods = loadedMods.filter(mod => mod.enabled)

	const patches = collectPatches(enabledMods)
	initSplashMenu(patches)
	initializeSettingsMenu(loadedMods, settingsPath, settings, patches)

	const patchableClassMap = getPatchableClasses()
	applyPatches(patches, patchableClassMap)

	updateCodex(enabledMods)
	loadStyles(enabledMods)
	onLoadMods(enabledMods)

	await finishLoader()
}

function init() {
	let onload: typeof window.onload = null
	const modloaderReady = main()
	async function onloadProxy(
		...args: Parameters<NonNullable<typeof window.onload>>
	) {
		try {
			await modloaderReady
		} catch (e) {
			log('Error during modloader execution:', e)
		}

		if (typeof onload === 'function') onload.apply(window, args)
	}

	window.onload = onloadProxy

	Object.defineProperty(window, 'onload', {
		get() {
			return onloadProxy
		},
		set(fn) {
			onload = fn
		},
		configurable: true,
		enumerable: false
	})
}

init()
