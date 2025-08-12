import { addLoaderError, setLoaderStatus } from '../ui/loader'
import { deepCopy } from '../utils/tools'

import type { LoadedMod } from './mod'

export function updateCodex(mods: LoadedMod[]) {
	setLoaderStatus('Applying codex updates')

	let codex = abstract_getCodex()

	for (const mod of mods) {
		try {
			const next = deepCopy(codex)
			mod.definition.updateCodex?.(mod.mctx, next)
			codex = next
		} catch (e) {
			addLoaderError({
				source: 'external',
				severity: 'error',
				summary: `An error occured while updating codex for mod "${mod.definition.name}".`,
				details: [e instanceof Error ? e.message : String(e)]
			})
		}
	}

	globalThis.abstract_getCodex = () => codex
}
