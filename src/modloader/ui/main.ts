import { createElement } from './element'
import { appendStyle, getStyles } from './style'

export const MODLOADER_UI_ROOT = createElement('div', 'modloader-root')

export function initializeUI() {
	appendStyle(getStyles(), '[modloader-builtin]')

	window.addEventListener('DOMContentLoaded', () => {
		document.body.appendChild(MODLOADER_UI_ROOT)
	})
}
