import path from 'path'

import { ipcRenderer } from 'electron'

import { setLoaderStatus } from '../ui/loader'

import type { ModToolbox } from '../../types/modloader'

export function deepFreeze<T>(target: T): T {
	if (typeof target === 'object' && target !== null) {
		// @ts-expect-error: index signature for symbol not inferred
		for (const propName of Reflect.ownKeys(target)) deepFreeze(target[propName])
		return Object.freeze(target)
	}

	if (typeof target === 'function') return Object.freeze(target)

	return target
}

export function deepCopy<T>(target: T): T {
	if (typeof target !== 'object' || target === null) return target

	if (Array.isArray(target)) return target.map(val => deepCopy(val)) as T

	const copy = {}
	for (const propName of Reflect.ownKeys(target)) {
		// @ts-expect-error: index signature for symbol not inferred
		copy[propName] = deepCopy(target[propName])
	}
	return copy as T
}

const LOG_PREFIX = '[MODLOADER]'
export function log(...args: unknown[]) {
	console.log(LOG_PREFIX, ...args)
}

declare const __dirname: string
export const MODS_DIR_PATH = path.join(__dirname, '../../../../mods')

const HEX_COLOR_REGEX = /^#([\da-f]{3,4}){1,2}$/

function validateHexColor(val: string, def: string, alpha: boolean): string {
	if (val.length < 3 || val.length > 9) return def

	const normalized = (val.startsWith('#') ? val : '#' + val).toLowerCase()
	if (!HEX_COLOR_REGEX.test(normalized)) return def

	switch (normalized.length) {
		case 4:
		case 5:
			const r = normalized[1]
			const g = normalized[2]
			const b = normalized[3]
			const a = alpha ? (normalized[4] ?? 'f') : ''

			return `#${r}${r}${g}${g}${b}${b}${a}${a}`
		case 7:
			return alpha ? normalized + 'ff' : normalized
		case 9:
			return alpha ? normalized : normalized.substring(0, 7)

		default:
			return def
	}
}

export const MOD_TOOLBOX: ModToolbox = {
	inModsDir(target: string) {
		return path.join(MODS_DIR_PATH, target)
	},

	newModLogger(namespace) {
		const prefix = `[MOD: ${namespace}]`
		const logger = {
			log: (...args: unknown[]) => console.log(prefix, ...args)
		}

		return Object.freeze(logger)
	},

	focusesTextEditableElement(): boolean {
		const element = document.activeElement
		if (!element) return false

		const tagName = element.tagName
		return (
			tagName === 'INPUT' ||
			tagName === 'TEXTAREA' ||
			tagName === 'SELECT' ||
			(element as HTMLElement).isContentEditable
		)
	},

	sanitizers: {
		nonNegative(val, _def) {
			return val < 0 ? 0 : val
		},
		colorHexRGB(val, def) {
			return validateHexColor(val, def, false)
		},
		colorHexRGBA(val, def) {
			return validateHexColor(val, def, true)
		}
	}
}

export function bindToolbox() {
	setLoaderStatus('Binding mod toolbox')

	Object.defineProperty(globalThis, 'MOD_TOOLBOX', {
		value: deepFreeze(MOD_TOOLBOX),
		writable: false,
		configurable: false,
		enumerable: false
	})
}

export function bindDevToolsHook() {
	setLoaderStatus('Binding dev tools hook')

	window.addEventListener('keydown', event => {
		if (event.ctrlKey && event.shiftKey && event.key === 'I') {
			ipcRenderer.send('ml-dt')
			log('Opening dev tools')
		}
	})
}
