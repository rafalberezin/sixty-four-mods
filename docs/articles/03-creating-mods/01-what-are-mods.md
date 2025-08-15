# What are mods?

Mods are **CommonJS** modules whose **default export** is an object implementing
the `Mod` interface:

```ts
export interface Mod<S extends ModSettingsDefinition = ModSettingsDefinition> {
	// REQUIRED
	id: string
	name: string
	description: string

	version: string
	gameVersion: string
	loaderVersion: string

	// OPTIONAL
	settings?: S

	getPatches?: (mctx: ModContext<S>) => PatchSpec
	updateCodex?: (mctx: ModContext<S>, codex: Codex) => void
	getStyles?: (mctx: ModContext<S>) => string
	onLoad?: (mctx: ModContext<S>) => void
}
```

The purpose of the generic parameter `S` will be explained in
[Using TypeScript](./04-using-typescript.md).

## Required Data

The following example contains the **minimal required data** to be recognized
and loaded correctly by the mod loader.

```js title=Minimal JS Example
module.exports = {
	id: 'your-unique-mod-id',
	name: 'Your Great Mod',
	description: 'This mod does...',

	version: '1.0.0',
	gameVersion: '1.2.1',
	loaderVersion: '1.1.0'
}
```

There are a couple of requirements to this data:

- The `id` must be **UNIQUE**. If any other installed mod has the same id, both
  mods **WILL NOT** be loaded.
- `version`, `gameVersion`, and `loaderVersion` follow
  [Semantic Versioning](https://semver.org/) (like in the example).
- Your mod object becomes **read-only** after mod loader touches it.

> [!IMPORTANT]
>
> You should not change your mod `id` after release. The `id` is used to
> uniquely identify your mod for things like saved settings, and changing it
> will cause players' settings to be reset.

## Optional Features

Most mods will also define some of the optional features:

### Static data:

- `settings` - Provides configuration options for your mod.

### Funtions:

- `getPatches` - Returns code patches to be applied to the game.
- `updateCodex` - Modifies the game `Codex`.
- `getStyles` - Injects custom CSS into the game.
- `onLoad` - Runs code after the mod is loaded.

Each of these will be explained in detail in later sections.

## File format

- Mods must be valid **JavaScript** files, with `.js` file extension.
- If written in TypeScript or split across multiple files, the code should be
  **bundled** into a single **CommonJS** file for distribution.

## Types

The true definitions of all the types described in this guide are available to
download for you to use:

- [Game Mappings](https://github.com/rafalberezin/sixty-four-mods/releases/download/mappings-latest/game.d.ts) -
  describes which classes and their methods are available to be modified, and
  provides helper types.
- [Mod Loader Types](https://github.com/rafalberezin/sixty-four-mods/releases/download/modloader-latest/modloader.d.ts) -
  describes the Mod Loader API, like the `Mod`, `PatchSpec`, etc. (dependant on
  mappings)

Using these types will be explained in
[Using Typescript](./04-using-typescript.md).

> [!TIP]
>
> It would be beneficial to get the available types for manual reference, even
> if you don't plan on using TypeScript.

## Mod Toolbox

The Mod Loader exposes a global `MOD_TOOLBOX` object containing useful
utilities:

- `inModsDir` - Transforms a path to be relative to the mods directory.
- `newModLogger` - Creates a logger for the given mod `id`.
- `focusesTextEditableElement` - Checks whether the player is currently focusing
  an element inside which they can write text. Use this to guard against
  triggering keydown events when the player is writing something.
- `sanitizers` - A collection of premade settings sanitizers:
  - `nonNegative` - Negative numbers become 0.
  - `colorHexRGB` - Hex string for a color.
  - `colorHexRGBA` - Hex string for a color with transparency.

Currently the logger contains only a single function `log` that works like
`console.log` except it adds a prefix to distinguish the source. You should use
it instead of the regular `console.log` for clarity and compatibility with
future features.

## Next

- [Creating Your First Mod](./02-your-first-mod.md)
