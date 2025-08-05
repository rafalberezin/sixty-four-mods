import { createElement } from './element'
import { MODLOADER_UI_ROOT } from './main'
import { openSettings } from './settings'
import { registerStyle, Z_INDEX } from './style'
import { addModPatches } from '../core/patch'

import type { PatchSpec } from '../../types/modloader'
import type { PatchCollection } from '../core/patch'

const SPLASH_UI = {
	root: createElement('div', 'ml-splash-menu', ['ml-column', 'ml-container']),
	header: createElement(
		'h2',
		'ml-splash-menu-header',
		['ml-heading'],
		'Mod Loader'
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

const BUILTIN_MOD_NAME = '[modloader-builtin]'

export function initSplashMenu(collection: PatchCollection) {
	addModPatches(collection, BUILTIN_MOD_NAME, splashPatchSpec)

	SPLASH_UI.settings.addEventListener('click', openSettings)
	SPLASH_UI.reload.addEventListener('click', () => {
		if (game) game.saveGame()
		document.location.reload()
	})

	SPLASH_UI.root.append(SPLASH_UI.header, SPLASH_UI.settings, SPLASH_UI.reload)
	MODLOADER_UI_ROOT.appendChild(SPLASH_UI.root)
}

registerStyle(`
#ml-splash-menu {
	left: 3rem;
	bottom: 4rem;
	z-index: ${Z_INDEX.splash};
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
