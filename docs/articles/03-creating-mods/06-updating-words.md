# Updating Words

Similar to `updateCodex`, mods can specify an `updateWords` function, which
allows you to modify the contents of the game `Words`.

```ts
updateWords?: (mctx: ModContext<S>, words: Words) => void
```

## What are the Words?

The game uses a Words object to store different texts displayed to the player,
translated to different languages. This object is created by the
`abstract_getWords` function from file `./scripts/words.js` (relative to
`index.html`)

The [game mappings](./01-what-are-mods.md#types) provide a rough shape for the
data available inside `Words`. For exact data, see the actual definition of
`abstract_getWords` inside `./scripts/words.js`.

## Modifying the Words

If specified, the `updateWords` function will be called with your `Mod Context`
and the `Words` object, for you to modify. You don't need to return anything
from this function, simply modify the given object as you wish.

If your mod changes something, you might want to update some descriptions to
clarify that. For example, if you updated the `Containment Vessel` to store 128
Chromalit instead of the default 32, you can update it's description like so:

```js
module.exports = {
	// All the required fields here...

	updateWords(mctx, words) {
		words.en.entities.vessel.description =
			'Stores 128 Chromalits, preventing their fission. Consumes a Hell Gem.'
	}
}
```

Or maybe you don't like that the `Hell Gem` is capitalized as `Hell gem` in the
achievements, and would like to change it:

```js
module.exports = {
	// All the required fields here...

	updateWords(mctx, words) {
		// It's the 4th achievement on the list so it's index is 3
		words.en.achievements[3].description = `Find a Hell Gem`

		// Or you might want to find it automatically by name
		const achievement = words.en.achievements.find(
			achievement => achievement.name === 'Green energy'
		)

		if (achievement !== undefined) {
			achievement.description = 'Find a Hell Gem'
		}
	}
}
```

There is a high chance you don't know all the available languages, but if you
update something you should most likely update the english version at least.

> [!NOTE]
>
> You are modifying a temporary copy of the words object, meaning you cannot
> save it to modify later.

## Next

- [Patching Methods](./07-patching-methods.md)
