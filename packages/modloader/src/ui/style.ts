import { createElement } from './element'
import { addLoaderError, setLoaderStatus } from './loader'
import { LoadedMod } from '../core/mod'

export const Z_INDEX = {
	loader: '20',
	settings: '10',
	splash: '0'
}

export const STYLE_VARS = {
	duration: {
		transition: '--ml-duration-transition',
		loaderFadeOut: '--ml-duration-loader-fadeout'
	},

	color: {
		accent: '--ml-accent',

		text: '--ml-text-color',
		fadedText: '--ml-text-faded-color',

		neutral: '--ml-neutral',
		green: '--ml-green',
		yellow: '--ml-yellow',
		red: '--ml-red',

		background: {
			accent: '--ml-bg-accent',
			base: '--ml-bg-base',

			neutral: '--ml-bg-neutral',
			green: '--ml-bg-green',
			yellow: '--ml-bg-yellow',
			red: '--ml-bg-red'
		}
	}
}

const sharedStyle = `
#modloader-root {
	position: absolute;
	width: 0 !important;
	height: 0 !important;
	top: 0 !important;
	left: 0 !important;
	color: var(${STYLE_VARS.color.text});
	font-family: 'Montserrat';
	z-index: 1000;
	isolation: isolate;

	${STYLE_VARS.duration.transition}: 150ms;

	${STYLE_VARS.color.text}: #eeeeee;
	${STYLE_VARS.color.fadedText}: #bbbbbb;

	${STYLE_VARS.color.neutral}: #2c2c3d;
	${STYLE_VARS.color.green}: #4aac32;
	${STYLE_VARS.color.yellow}: #bb8437;
	${STYLE_VARS.color.red}: #99232f;

	${STYLE_VARS.color.background.base}: #101010;

	${STYLE_VARS.color.background.neutral}: color-mix(in oklab, var(${STYLE_VARS.color.neutral}) 20%, var(${STYLE_VARS.color.background.base}));
	${STYLE_VARS.color.background.green}: color-mix(in oklab, var(${STYLE_VARS.color.green}) 20%, var(${STYLE_VARS.color.background.base}));
	${STYLE_VARS.color.background.yellow}: color-mix(in oklab, var(${STYLE_VARS.color.yellow}) 10%, var(${STYLE_VARS.color.background.base}));
	${STYLE_VARS.color.background.red}: color-mix(in oklab, var(${STYLE_VARS.color.red}) 10%, var(${STYLE_VARS.color.background.base}));

	${STYLE_VARS.color.accent}: var(${STYLE_VARS.color.neutral});
	${STYLE_VARS.color.background.accent}: var(${STYLE_VARS.color.background.neutral});
}

#modloader-root > * {
	position: fixed !important;
}

#modloader-root, #modloader-root :is(*, *::before, *::after) {
	margin: 0;
	box-sizing: border-box;
	-webkit-user-select: none;
	user-select: none;
}

.ml-green {
	${STYLE_VARS.color.accent}: var(${STYLE_VARS.color.green});
	${STYLE_VARS.color.background.accent}: var(${STYLE_VARS.color.background.green});
}

.ml-yellow {
	${STYLE_VARS.color.accent}: var(${STYLE_VARS.color.yellow});
	${STYLE_VARS.color.background.accent}: var(${STYLE_VARS.color.background.yellow});
}

.ml-red {
	${STYLE_VARS.color.accent}: var(${STYLE_VARS.color.red});
	${STYLE_VARS.color.background.accent}: var(${STYLE_VARS.color.background.red});
}

.ml-container {
	padding: 1em;
	background-color: var(${STYLE_VARS.color.background.accent});
	border: 1px solid var(${STYLE_VARS.color.accent});
	border-radius: 0.5rem;
}

.ml-text-color {
	color: var(${STYLE_VARS.color.accent});
}

.ml-column {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.ml-overlay {
	display: grid;
	place-content: center;
	gap: 1rem;
	position: absolute;
	width: 100vw;
	height: 100vh;
	padding: 1rem;
	background-color: var(${STYLE_VARS.color.background.base});
	overflow-y: auto;
}

.ml-button {
	display: block;
	padding: 1rem 2rem;
	width: fit-content;
	background-color: var(${STYLE_VARS.color.accent});
	color: var(${STYLE_VARS.color.text});
	letter-spacing: 1px;
	text-transform: uppercase;
	border: none;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: filter var(${STYLE_VARS.duration.transition}) ease-out;
}

.ml-button:hover {
	filter: brightness(1.2);
}

.ml-heading {
	text-align: center;
	font-weight: normal;
	letter-spacing: 1px;
}

.ml-scroll {
	overflow-y: auto;
}

.ml-scroll::-webkit-scrollbar {
	width: 1.2rem;
}

.ml-scroll::-webkit-scrollbar-track {
	background-color: #ffffff10;
	background-clip: content-box;
	border-radius: 0.6rem;
	border: 0.25rem solid transparent;
}

.ml-scroll::-webkit-scrollbar-thumb {
	background-color: var(${STYLE_VARS.color.text});
	background-clip: content-box;
	border-radius: 0.6rem;
	border: 0.25rem solid transparent;
	cursor: pointer;
}

.ml-input {
	padding: 0.5rem;
	background-color: var(${STYLE_VARS.color.background.accent});
	border: 1px solid var(${STYLE_VARS.color.accent});
	border-radius: 0.5rem;
	color: var(${STYLE_VARS.color.text});
}
`

const loaderStyles: string[] = [sharedStyle]

export function registerStyle(style: string) {
	loaderStyles.push(style)
}

export function getStyles() {
	return loaderStyles.map(s => s.trim()).join('\n\n')
}

export function appendStyle(style: string, source: string): HTMLStyleElement {
	const element = createElement('style')

	element.innerHTML = style
	element.dataset.source = source

	document.head.appendChild(element)

	return element
}

export function loadStyles(mods: LoadedMod[]) {
	setLoaderStatus('Applying mod styles')

	for (const mod of mods) {
		if (mod.definition.getStyles === undefined) continue

		try {
			const styles = mod.definition.getStyles(mod.mctx)
			if (typeof styles !== 'string') throw new Error('Not a string')
			mod.styles = styles.trim()
		} catch (e) {
			addLoaderError({
				source: 'external',
				severity: 'error',
				summary: `An error occured while loading styles for mod "${mod.definition.name}".`,
				details: [e instanceof Error ? e.message : String(e)]
			})
			continue
		}

		appendStyle(mod.styles, mod.definition.id)
	}
}
