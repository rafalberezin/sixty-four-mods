import { createElement } from './element'
import { setLoaderStatus } from './loader'
import { MODLOADER_UI_ROOT } from './main'
import { registerStyle, STYLE_VARS, Z_INDEX } from './style'
import { saveSettings } from '../core/settings'

import type {
	ModSettingsDefinitionEntry,
	ModSettings,
	SettingTypes
} from '../../types/modloader'
import type { LoadedMod } from '../core/mod'
import type { LoaderSettings } from '../core/settings'

const SETTINGS_UI = {
	root: createElement('div', 'ml-settings', ['ml-overlay']),
	header: createElement(
		'h2',
		'ml-settings-header',
		['ml-heading'],
		'Mod Settings'
	),
	content: createElement('div', 'ml-settings-content', [
		'ml-column',
		'ml-scroll'
	]),
	footer: createElement('div', 'ml-settings-footer', ['ml-column']),
	actions: createElement('div', 'ml-settings-actions'),
	changeCounter: createElement(
		'div',
		'ml-settings-change-counter',
		['ml-heading'],
		'0 changes'
	),
	cancel: createElement(
		'button',
		'ml-settings-cancel',
		['ml-button'],
		'Cancel'
	),
	save: createElement(
		'button',
		'ml-settings-save',
		['ml-button'],
		'Save and Reload'
	)
}

type SettingChanges = {
	[modId: string]: {
		[settingId: string]: SettingChange
	}
}

type EnableChanges = {
	[modId: string]: SettingChange<'boolean'>
}

type SettingChange<T extends keyof SettingTypes = keyof SettingTypes> = {
	type: T
	current: SettingTypes[T]
	new: SettingTypes[T]
	reset: () => void
}

let settingChanges: SettingChanges = {}
let enableChanges: EnableChanges = {}
let changeCounter = 0

function changeEnabled(
	mod: LoadedMod,
	enabled: boolean,
	label: HTMLLabelElement,
	reset: () => void
) {
	updateEnabledLabel(enabled, label)

	const modId = mod.definition.id
	const isChanged = modId in enableChanges

	if (mod.enabled === enabled) {
		if (isChanged) {
			delete enableChanges[mod.definition.id]
			updateCounter(-1)
		}

		return
	}

	if (isChanged) {
		enableChanges[modId].new = enabled
		return
	}

	updateCounter(1)
	enableChanges[modId] = {
		type: 'boolean',
		current: mod.enabled,
		new: enabled,
		reset
	}
}

function updateEnabledLabel(enabled: boolean, label: HTMLLabelElement) {
	label.classList.toggle('ml-green', enabled)
	label.classList.toggle('ml-red', !enabled)
	label.textContent = enabled ? 'Enabled' : 'Disabled'
}

function changeSetting(
	mod: LoadedMod,
	settingId: string,
	value: SettingTypes[keyof SettingTypes],
	reset: () => void
) {
	if (!mod.settings || !(settingId in mod.settings)) return
	const modId = mod.definition.id
	const current = mod.settings[settingId]

	const modSettingChanges = (settingChanges[modId] ??= {})
	const isChanged = settingId in modSettingChanges

	if (current.value === value) {
		if (isChanged) {
			delete modSettingChanges[settingId]
			updateCounter(-1)

			if (Object.keys(modSettingChanges).length === 0) {
				delete settingChanges[modId]
			}
		}

		return
	}

	if (isChanged) {
		modSettingChanges[settingId].new = value
		return
	}

	updateCounter(1)
	modSettingChanges[settingId] = {
		type: current.type,
		current: current.value,
		new: value,
		reset
	}
}

function updateCounter(change?: number) {
	if (change !== undefined) changeCounter += change
	else {
		changeCounter =
			Object.keys(enableChanges).length +
			Object.values(settingChanges).reduce(
				(count, group) => count + Object.keys(group).length,
				0
			)
	}

	SETTINGS_UI.changeCounter.innerText = `${changeCounter} change${changeCounter === 1 ? '' : 's'}`
	SETTINGS_UI.changeCounter.classList.toggle('ml-changed', changeCounter !== 0)
}

function applyChanges(settingsPath: string, settings: LoaderSettings) {
	for (const mod in enableChanges) {
		const modSettings = settings.mods[mod]
		if (modSettings === undefined) continue

		modSettings.enabled = enableChanges[mod].new
	}

	for (const mod in settingChanges) {
		const modSettings = settings.mods[mod]?.settings
		if (modSettings === undefined) continue

		const modChanges = settingChanges[mod]
		const newSettings: ModSettings = {}

		for (const setting in modSettings) {
			const modSetting = modSettings[setting]
			const modChange = modChanges[setting]

			if (modChange === undefined) {
				newSettings[setting] = modSetting
				continue
			}

			newSettings[setting] = {
				type: modSetting.type,
				value: modChange.new
			}
		}

		settings.mods[mod].settings = newSettings
	}

	saveSettings(settingsPath, settings)
}

function discardChanges() {
	for (const change of Object.values(enableChanges)) {
		change.reset()
	}
	enableChanges = {}

	for (const changeGroup of Object.values(settingChanges)) {
		for (const change of Object.values(changeGroup)) {
			change.reset()
		}
	}
	settingChanges = {}

	updateCounter(-changeCounter)
}

export function initializeSettings(
	mods: LoadedMod[],
	settingsPath: string,
	settings: LoaderSettings
) {
	setLoaderStatus('Initializing settings menu')

	SETTINGS_UI.root.append(
		SETTINGS_UI.header,
		SETTINGS_UI.content,
		SETTINGS_UI.footer
	)

	for (const mod of mods) SETTINGS_UI.content.appendChild(createSection(mod))

	SETTINGS_UI.footer.append(SETTINGS_UI.changeCounter, SETTINGS_UI.actions)
	SETTINGS_UI.actions.append(SETTINGS_UI.cancel, SETTINGS_UI.save)

	SETTINGS_UI.cancel.addEventListener('click', () => {
		discardChanges()
		closeSettings()
	})

	SETTINGS_UI.save.addEventListener('click', () => {
		applyChanges(settingsPath, settings)
		if (game) game.saveGame()
		document.location.reload()
	})

	MODLOADER_UI_ROOT.appendChild(SETTINGS_UI.root)
}

function createSection(mod: LoadedMod): HTMLDivElement {
	const section = createElement('div', undefined, [
		'ml-settings-mod',
		'ml-column',
		'ml-container'
	])
	section.appendChild(
		createElement(
			'h3',
			undefined,
			['ml-settings-mod-name', 'ml-heading'],
			mod.definition.name
		)
	)

	const enabledId = `ml-settings-mod-enabled-${mod.definition.id}`
	const enabled = createElement('input', enabledId, ['ml-settings-mod-enabled'])
	enabled.type = 'checkbox'
	enabled.checked = mod.enabled
	enabled.addEventListener('change', () =>
		changeEnabled(mod, enabled.checked, label, () => {
			enabled.checked = mod.enabled
			updateEnabledLabel(mod.enabled, label)
		})
	)

	const label = createElement('label', undefined, [
		'ml-settings-mod-enabled-label',
		'ml-container'
	])
	label.htmlFor = enabledId
	updateEnabledLabel(mod.enabled, label)

	section.append(
		enabled,
		label,
		createElement(
			'p',
			undefined,
			['ml-settings-mod-description'],
			mod.definition.description
		)
	)

	for (const setting in mod.definition.settings) {
		section.appendChild(
			createSetting(
				mod,
				setting,
				mod.definition.settings[setting] as ModSettingsDefinitionEntry<
					keyof SettingTypes
				>,
				(mod.settings as ModSettings)[setting].value
			)
		)
	}

	return section
}

function createSetting<T extends keyof SettingTypes>(
	mod: LoadedMod,
	settingId: string,
	definition: ModSettingsDefinitionEntry<T>,
	value: SettingTypes[T]
): HTMLDivElement {
	const root = createElement('div', undefined, [
		'ml-settings-mod-setting',
		`ml-setting-${definition.type}`,
		'ml-column'
	])

	root.appendChild(
		createElement(
			'h4',
			undefined,
			['ml-settings-mod-setting-name', 'ml-heading'],
			definition.name
		)
	)
	if (definition.description)
		root.appendChild(
			createElement(
				'p',
				undefined,
				['ml-settings-mod-setting-description'],
				definition.description
			)
		)

	const input = createElement('input', undefined, [
		'ml-settings-mod-setting-input',
		'ml-input'
	])

	let valueGetter: () => SettingTypes[keyof SettingTypes]
	let valueReset: () => void

	switch (definition.type) {
		case 'boolean':
			input.type = 'checkbox'
			input.checked = value as boolean
			valueGetter = () => input.checked
			valueReset = () => {
				input.checked = value as boolean
			}
			break
		case 'number':
			input.type = 'number'
			input.value = String(value as number)
			valueGetter = () => input.valueAsNumber
			valueReset = () => {
				input.value = String(value as number)
			}
			break
		case 'string':
			input.type = 'text'
			input.value = value as string
			valueGetter = () => input.value
			valueReset = () => {
				input.value = value as string
			}
			break
	}

	input.addEventListener('change', () =>
		changeSetting(mod, settingId, valueGetter(), valueReset)
	)

	root.appendChild(input)

	return root
}

export function openSettings() {
	SETTINGS_UI.root.classList.add('ml-open')
}

function closeSettings() {
	SETTINGS_UI.root.classList.remove('ml-open')
}

registerStyle(`
#ml-settings {
	padding: 3rem 0;
	text-align: center;
	z-index: ${Z_INDEX.settings};
}

#ml-settings:not(.ml-open) {
	display: none;
}

#ml-settings-header {
	font-size: 3rem;
}

#ml-settings-content {
	padding: 1rem;
	width: inherit;
	max-width: 60ch;
}

.ml-settings-mod {
	align-items: center
}

.ml-settings-mod-name {
	font-size: 2rem;
}

.ml-settings-mod-setting {
	gap: 0.5rem;
	align-items: center;
}

.ml-settings-mod-enabled {
	display: none;
}

.ml-settings-mod-enabled-label {
	width: 12ch;
	font-weight: bold;
	letter-spacing: 1px;
	color: var(${STYLE_VARS.color.red});
	cursor: pointer;
}

.ml-settings-mod-enabled-label.ml-green {
	color: var(${STYLE_VARS.color.green});
}

.ml-settings-mod-setting-name {
	font-size: 1.2rem;
	font-weight: bold;
}

.ml-settings-mod-setting-input {
	max-width: 40ch;
}

#ml-settings-change-counter {
	font-size: 1.2rem;
	text-transform: uppercase;
}

#ml-settings-actions {
	display: flex;
	justify-content: center;
	gap: 0.5rem;
}

#ml-settings-actions > .ml-button {
	min-width: 35ch;
}`)
