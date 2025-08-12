import { createElement } from './element'
import { MODLOADER_UI_ROOT } from './main'
import { registerStyle, STYLE_VARS, Z_INDEX } from './style'
import { VERSIONS } from '../utils/version'

const LOADER_UI = {
	root: createElement('div', 'ml-loader', ['ml-overlay']),
	header: createElement('div', 'ml-loader-header'),
	title: createElement(
		'h1',
		'ml-loader-title',
		['ml-heading'],
		'Sixty Four Mod Loader'
	),
	version: createElement(
		'div',
		'ml-loader-version',
		undefined,
		`v${VERSIONS.loader.str}`
	),
	status: createElement('p', 'ml-loader-status'),
	errors: createElement('div', 'ml-loader-errors', [
		'ml-column',
		'ml-container',
		'ml-scroll'
	]),
	actions: createElement('div', 'ml-loader-actions'),
	ignore: createElement('button', 'ml-loader-ignore', ['ml-button'], 'Ignore'),
	reload: createElement('button', 'ml-loader-reload', ['ml-button'], 'Reload')
}

export function initializeLoader() {
	MODLOADER_UI_ROOT.appendChild(LOADER_UI.root)
	LOADER_UI.root.append(LOADER_UI.header, LOADER_UI.status)
	LOADER_UI.header.append(LOADER_UI.title, LOADER_UI.version)

	setLoaderFadeOutDuration(loaderFadeOutDuration)
}

export function setLoaderStatus(status: string) {
	LOADER_UI.status.innerText = status
}

let loaderFadeOutDuration = 1000
export function setLoaderFadeOutDuration(duration: number) {
	loaderFadeOutDuration = duration
	LOADER_UI.root.style.setProperty(
		STYLE_VARS.duration.loaderFadeOut,
		`${loaderFadeOutDuration}ms`
	)
}

type ErrorSource = 'internal' | 'external'
type ErrorSeverity = 'error' | 'warning'
type LoaderError = {
	source: ErrorSource
	severity: ErrorSeverity
	summary: string
	details?: string[]
}

const loaderErrors = {
	internal: {
		title: 'Loader errors',
		entries: [] as LoaderError[]
	},
	external: {
		title: 'Mod errors',
		entries: [] as LoaderError[]
	}
}

export function addLoaderError(error: LoaderError) {
	loaderErrors[error.source].entries.push(error)
}

export async function finishLoader() {
	if (
		loaderErrors.internal.entries.length > 0 ||
		loaderErrors.external.entries.length > 0
	)
		await showErrorScreen()

	closeLoader()
}

async function showErrorScreen() {
	for (const groupType in loaderErrors) {
		const errorGroup = loaderErrors[groupType as keyof typeof loaderErrors]
		if (errorGroup.entries.length === 0) continue

		const group = createElement('div', undefined, ['ml-column'])
		group.appendChild(
			createElement(
				'h2',
				undefined,
				['ml-loader-error-group-title', 'ml-heading'],
				errorGroup.title
			)
		)
		LOADER_UI.errors.appendChild(group)

		for (const error of errorGroup.entries)
			group.appendChild(buildErrorElement(error))
	}

	LOADER_UI.actions.append(LOADER_UI.ignore, LOADER_UI.reload)
	LOADER_UI.reload.addEventListener('click', () => document.location.reload())

	LOADER_UI.status.replaceWith(LOADER_UI.errors, LOADER_UI.actions)

	await new Promise(resolve => {
		LOADER_UI.ignore.addEventListener('click', resolve)
	})

	LOADER_UI.errors.remove()
	LOADER_UI.actions.remove()
	LOADER_UI.root.append(LOADER_UI.status)
}

function buildErrorElement(error: LoaderError): HTMLDivElement {
	const root = createElement('div', undefined, [
		'ml-loader-error',
		'ml-container',
		'ml-column',
		`ml-${error.severity === 'error' ? 'red' : 'yellow'}`
	])

	root.appendChild(
		createElement('p', undefined, ['ml-loader-error-message'], error.summary)
	)

	if (error.details?.length) {
		const details = createElement('details', undefined, [
			'ml-loader-details',
			'ml-column'
		])
		root.appendChild(details)

		details.appendChild(
			createElement(
				'summary',
				undefined,
				['ml-loader-details-summary'],
				'See details'
			)
		)

		const content = createElement('div', undefined, [
			'ml-loader-details-content',
			'ml-column'
		])
		details.append(content)

		for (const detail of error.details)
			content.appendChild(
				createElement('p', undefined, ['ml-loader-details-line'], detail)
			)
	}

	return root
}

function closeLoader() {
	LOADER_UI.status.innerText = 'Loaded Successfully'
	LOADER_UI.root.classList.add('finished')

	setTimeout(() => LOADER_UI.root.remove(), loaderFadeOutDuration)
}

registerStyle(`
#ml-loader {
	transition: opacity var(${STYLE_VARS.duration.loaderFadeOut}, 1000ms) ease-out;
	z-index: ${Z_INDEX.loader};
}

#ml-loader.finished {
	pointer-events: none;
	opacity: 0;
}

#ml-loader-title {
	font-size: 3rem;
}

#ml-loader-version {
	color: var(${STYLE_VARS.color.fadedText});
	font-size: 0.9rem;
}

#ml-loader-header,
#ml-loader-status {
	text-align: center;
}

#ml-loader-errors {
	gap: 2rem;
	width: 60ch;
	max-width: 100%;
	height: 40vh;
}

.ml-loader-error-group-title {
	font-size: 2rem;
}

.ml-loader-error {
	gap: 0.5rem;
	padding: 0.5rem;
	border: 1px solid;
}

.ml-loader-error.ml-yellow {
	--ml-error-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23987038" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>');
}

.ml-loader-error.ml-red {
    --ml-error-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23803038" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16h.01"/><path d="M12 8v4"/><path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"/></svg>');
}

.ml-loader-error-message {
	position: relative;
	padding-left: 1.5rem;
}

.ml-loader-error-message::before {
	content: '';
	position: absolute;
	width: 1rem;
	aspect-ratio: 1;
	left: 0;
	background-image: var(--ml-error-icon);
	background-size: cover;
}

.ml-loader-details {
	gap: 0.5rem;
}

.ml-loader-details-summary {
	color: var(${STYLE_VARS.color.fadedText});
	cursor: pointer;
}

.ml-loader-details-summary:hover {
	color: var(${STYLE_VARS.color.text});
}

.ml-loader-details-content {
	gap: 0.5rem;
	padding: 0.5rem 1rem;
}

#ml-loader-actions {
	display: flex;
	justify-content: center;
	gap: 1rem;
}

#ml-loader-actions .ml-button {
	min-width: 35ch;
}

#ml-loader-ignore {
	background-color: var(${STYLE_VARS.color.red});
}`)
