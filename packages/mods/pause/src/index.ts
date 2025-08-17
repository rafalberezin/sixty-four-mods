import { Mod, ModSettingsDefinition, PatchSpec } from 'modloader/types'

declare const __VERSION__: string

declare global {
	interface Game {
		halt: boolean
		time: {
			dt: number
		}
	}
}

const id = 'pause'

let paused = false

const indicator = document.createElement('div')
indicator.id = `${id}-pause-indicator`
indicator.innerText = 'PAUSED'

const styles = `
#${indicator.id} {
	position: fixed;
	top: 3rem;
	left: 50vw;
	color: black;
	font-size: 2rem;
	font-weight: bold;
	font-family: 'Montserrat';
	letter-spacing: 5px;
	transform: translateX(-50%);
	pointer-events: none;
	opacity: 0.6;
}

#${indicator.id}:not(.show) {
	display: none;
}
`

const muteStyles = `
#${indicator.id}::after {
	content: '';
	display: block;
	position: relative;
	left: 50%;
	width: 2rem;
	background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBmaWxsPSJibGFjayIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExIDQuNzAyYS43MDUuNzA1IDAgMCAwLTEuMjAzLS40OThMNi40MTMgNy41ODdBMS40IDEuNCAwIDAgMSA1LjQxNiA4SDNhMSAxIDAgMCAwLTEgMXY2YTEgMSAwIDAgMCAxIDFoMi40MTZhMS40IDEuNCAwIDAgMSAuOTk3LjQxM2wzLjM4MyAzLjM4NEEuNzA1LjcwNSAwIDAgMCAxMSAxOS4yOTh6Ii8+CjxsaW5lIHgxPSIyMiIgeDI9IjE2IiB5MT0iOSIgeTI9IjE1Ii8+CjxsaW5lIHgxPSIxNiIgeDI9IjIyIiB5MT0iOSIgeTI9IjE1Ii8+Cjwvc3ZnPgo=);
	aspect-ratio: 1;
	transform: translateX(-50%);
}
`

const settings = {
	mutePaused: {
		type: 'boolean',
		name: 'Mute Paused',
		description: 'Mute the game when paused.',
		default: false,
		sanitize: a => a
	}
} satisfies ModSettingsDefinition

export default {
	id,
	name: 'Pause',
	description:
		'Pause the game by pressing "p", while still being able to interact with it.',

	version: __VERSION__,
	gameVersion: '1.2.1',
	loaderVersion: '1.0.0',

	settings,

	getPatches(mctx) {
		const patches: PatchSpec = {
			Game: {
				wrap: {
					updateCycle(ctx, span, silent) {
						if (!paused || game.halt) return ctx.original(span, silent)

						const self = ctx.self

						self.halt = true
						const res = ctx.original(span, silent)
						self.halt = false

						self.updateVFX(self.time.dt)
						self.updateResourcePops(self.time.dt)

						return res
					}
				}
			}
		}

		if (mctx.settings.mutePaused.value) {
			patches.Game!.wrap!.fadeSound = (ctx, v) => {
				if (paused) v = 0
				ctx.original(v)
			}
		}

		return patches
	},

	getStyles(mctx) {
		return mctx.settings.mutePaused.value ? styles + muteStyles : styles
	},

	onLoad(mctx) {
		if (document.body !== null) {
			document.body.appendChild(indicator)
		} else {
			window.addEventListener('DOMContentLoaded', () => {
				document.body.appendChild(indicator)
			})
		}

		window.addEventListener('keydown', event => {
			if (
				event.key !== 'p' ||
				game.splash.isShown ||
				MOD_TOOLBOX.focusesTextEditableElement()
			) {
				return
			}

			paused = !paused
			indicator.classList.toggle('show', paused)

			if (mctx.settings.mutePaused.value) game.fadeSound(1)
		})
	}
} satisfies Mod<typeof settings>
