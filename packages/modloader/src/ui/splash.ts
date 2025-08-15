import { createElement } from './element'
import { setLoaderStatus } from './loader'
import { MODLOADER_UI_ROOT } from './main'
import { openSettings } from './settings'
import { registerStyle, Z_INDEX } from './style'
import { addModPatches, BUILTIN_MOD_NAME } from '../core/patch'
import { VERSIONS } from '../utils/version'

import type { PatchCollection } from '../core/patch'
import type { PatchSpec } from '../types/modloader'

const SPLASH_UI = {
	root: createElement('div', 'ml-splash-menu', ['ml-column', 'ml-container']),
	header: createElement('div'),
	title: createElement(
		'h2',
		'ml-splash-menu-header',
		['ml-heading'],
		'Mod Loader'
	),
	version: createElement(
		'p',
		'ml-splash-menu-version',
		undefined,
		`v${VERSIONS.loader.str}`
	),
	settings: createElement(
		'button',
		'ml-splash-menu-settings',
		['ml-button'],
		'Settings'
	),
	reload: createElement(
		'button',
		'ml-splash-menu-reload',
		['ml-button'],
		'Reload'
	)
}

const splashPatchSpec = {
	Splash: {
		observe: {
			show: openSplashMenu,
			close: closeSplashMenu
		}
	}
} satisfies PatchSpec

function openSplashMenu() {
	SPLASH_UI.root.classList.add('ml-open')
}

function closeSplashMenu() {
	SPLASH_UI.root.classList.remove('ml-open')
}

export function initSplashMenu(patches: PatchCollection) {
	setLoaderStatus('Initializing splash menu')

	addModPatches(patches, BUILTIN_MOD_NAME, splashPatchSpec)

	SPLASH_UI.settings.addEventListener('click', openSettings)
	SPLASH_UI.reload.addEventListener('click', () => {
		if (game) game.saveGame()
		document.location.reload()
	})

	SPLASH_UI.header.append(SPLASH_UI.title, SPLASH_UI.version)
	SPLASH_UI.root.append(SPLASH_UI.header, SPLASH_UI.settings, SPLASH_UI.reload)
	MODLOADER_UI_ROOT.appendChild(SPLASH_UI.root)
}

registerStyle(`
#ml-splash-menu {
	left: 3rem;
	bottom: 4rem;
	z-index: ${Z_INDEX.splash};
}

#ml-splash-menu-version {
	font-size: 0.8rem;
	text-align: center;
	letter-spacing: 2px;
	opacity: 0.7;
}

#ml-splash-menu:not(.ml-open) {
	display: none;
}

#ml-splash-menu {
	font-size: 1.2rem;
	width: max-content;
	gap: 1rem;
}

#ml-splash-menu .ml-button {
	width: 100%
}
`)
