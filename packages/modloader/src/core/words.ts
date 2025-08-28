import { addLoaderError, setLoaderStatus } from '../ui/loader'
import { deepCopy } from '../utils/tools'

import type { LoadedMod } from './mod'

export function updateWords(mods: LoadedMod[]) {
	setLoaderStatus('Applying words updates')

	let words = abstract_getWords()

	for (const mod of mods) {
		try {
			const next = deepCopy(words)
			mod.definition.updateWords?.(mod.mctx, next)
			words = next
		} catch (e) {
			addLoaderError({
				source: 'external',
				severity: 'error',
				summary: `An error occured while updating words for mod "${mod.definition.name}".`,
				details: [e instanceof Error ? e.message : String(e)]
			})
		}
	}

	globalThis.abstract_getWords = () => words
}
