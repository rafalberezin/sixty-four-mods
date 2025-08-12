import { addLoaderError, setLoaderStatus } from '../ui/loader'
import { log } from '../utils/tools'

type GameMethodsLoadScript = (
	url: string,
	_unused_callback?: unknown
) => Promise<void>
type InternalGameType = typeof Game & {
	prototype: Game & {
		loadScript: GameMethodsLoadScript
	}
}

const GAME_SCRIPT_PRELOAD_URLS = [
	`scripts/bezier.js`,
	`scripts/ui.js`,
	`scripts/sprites.js`,
	`scripts/stuff.js`,
	`scripts/words.js`,
	`scripts/codex.js`,
	`scripts/osimp.js`,
	`scripts/mobile.js`
]

async function preloadScript(url: string) {
	return new Promise<void>((resolve, reject) => {
		const element = document.createElement('script')
		element.type = 'text/javascript'
		element.src = url

		element.onload = () => {
			log(`Preloaded script: ${url}`)
			resolve()
		}
		element.onerror = () => {
			log(`Script preload failed: ${url}`)
			reject(url)
		}

		document.head.appendChild(element)
	})
}

export async function preloadGameScripts() {
	setLoaderStatus('Preloading game scripts for patching')
	;(Game as InternalGameType).prototype.loadScript =
		new Proxy<GameMethodsLoadScript>(
			(Game as InternalGameType).prototype.loadScript,
			{
				apply(target, thisArg, argArray) {
					if (GAME_SCRIPT_PRELOAD_URLS.includes(argArray[0]))
						return Promise.resolve()

					return Reflect.apply(target, thisArg, argArray)
				}
			}
		)

	const results = await Promise.allSettled(
		GAME_SCRIPT_PRELOAD_URLS.map(preloadScript)
	)

	const fails = results.filter(result => result.status === 'rejected')
	if (fails.length === 0) return

	addLoaderError({
		source: 'internal',
		severity: 'warning',
		summary: `${fails.length} game script${fails.length > 1 ? 's' : ''} failed to preload`,
		details: [
			'Mods depending on these scripts may fail:',
			...fails.map(fail => `"${fail}"`)
		]
	})
}
