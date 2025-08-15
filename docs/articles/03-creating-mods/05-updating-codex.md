# Updating Codex

Mods can specify an `updateCodex` function, which allows you to modify the
contents of the game `Codex`.

```ts
updateCodex?: (mctx: ModContext<S>, codex: Codex) => void
```

## What is the Codex?

The game uses an object called `Codex` to store static predefined data for
resources, machines, achievemetns, etc. This object is created by the
`abstract_getCodex` function from file `./scripts/codex.js` (relative to
`index.html`)

The [game mappings](./01-what-are-mods.md#types) provide a rough shape for the
data available inside the `Codex`. For exact data, see the actual definition
inside `./scripts/codex.js`.

## Modifying the Codex

If specified, the `updateCodex` function will be called with your `Mod Context`
and the `Codex` object, for you to modify. You don't need to return anything
from this function, simply modify the given object as you wish.

For example, if you want to disable buying the **Excavating Channel**, as to not
break the **Neophobia** achievement accidentally.

```js
module.exports = {
	// All the required fields here...

	updateCodex(mctx, codex) {
		codex.entities.pump2.canPurchase = false

		// In this case, due to the shop logic,
		// you will also need to disable `merge`
		// for the Extracting Channel (internally called "pump")
		// as to not affect the grouping logic.
		codex.entities.pump.merge = false
	}
}
```

> [!NOTE]
>
> You are modifying a temporary copy of the codex, meaning you cannot save it to
> modify later.

## Next

- [Patching Methods](./06-patching-methods.md)
