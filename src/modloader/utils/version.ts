export type VersionArray = [number, number, number]
export type Version = {
	arr: VersionArray
	str: string
}

const LOADER_VERSION: VersionArray = [1, 0, 0]
const TARGET_GAME_VERSION: VersionArray = [1, 2, 1]

export const VERSIONS = {
	loader: versionFromArray(LOADER_VERSION),
	gameTarget: versionFromArray(TARGET_GAME_VERSION)
}

function versionFromArray(version: VersionArray): Version {
	return { arr: version, str: version.join('.') }
}

const SIMPLE_VERSION_REGEX = /^v?(\d+)\.(\d+)\.(\d+).*$/
export function versionFromString(versionStr: string): Version | undefined {
	const result = SIMPLE_VERSION_REGEX.exec(versionStr)
	if (result === null) return undefined

	const major = parseInt(result[1])
	const minor = parseInt(result[2])
	const patch = parseInt(result[3])
	return { arr: [major, minor, patch], str: versionStr }
}

export function isVersionString(versionStr: string): boolean {
	return SIMPLE_VERSION_REGEX.test(versionStr)
}

const VERSION_SEARCH_REGEX = /this\.version\s*=\s*["'`]([\d.]+)["'`]/
export function extractGameVersion(): Version | undefined {
	const gameStr = Game.toString()
	const result = VERSION_SEARCH_REGEX.exec(gameStr)
	if (result === null) return undefined
	return versionFromString(result[1])
}

export function isCompatibleVersion(
	version: Version,
	compareTo: Version,
	exact?: boolean
): boolean {
	if (exact)
		return (
			version.arr[0] === compareTo.arr[0] &&
			version.arr[1] === compareTo.arr[1] &&
			version.arr[2] === compareTo.arr[2]
		)

	if (version.arr[0] !== compareTo.arr[0]) return false
	if (version.arr[1] > compareTo.arr[1]) return false
	if (version.arr[1] === compareTo.arr[1] && version.arr[2] > compareTo.arr[2])
		return false

	return true
}
