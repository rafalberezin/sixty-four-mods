# Your First Mod

Let's make a very simple mod together. By the end of this section, you'll have a
working `.js` file that the loader can detect and run.

## Step 1 - Set up

1. **Locate your mods folder**

   After installing the loader, you should have a `mods` folder in the game
   directory. If it's missing create it yourself.

2. **Choose a mod name**

   You'll need a unique `id` for your mod, usually mirroring the mod name for
   clarity.

   I suggest choosing a short descriptive mod name, and using it for the `id`
   formatted in
   [kebab-case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case)

   Example: `awesome-mod`

## Step 2 - Create the file

Inthe `mods` folder create a file for your mod with `.js` file extension. I
suggest using your mod `id` as the file name: `awesome-mod.js`.

Add the default export to this file containing the required properties:

```js title=mods/awesome-mod.js
module.exports = {
	id: 'awesome-mod',
	name: 'Awesome Mod',
	description: 'Does some great stuff...',

	version: '1.0.0',
	gameVersion: '1.2.1',
	loaderVersion: '1.1.0'
}
```

- `version` is the version of your mod.
- `gameVersion` and `loaderVersion` are the versions of the game and the mod
  loader you used when creating your mod.

## Step 3 - Test It

Now when you start the game (or press the **Reload** button):

- if there are any issues the Mod Loader will display an **error screen**.
- if everything works, you should be able to see your mod inside the **settings
  menu**.

## Step 4 - Try Something Visual

Let's make the mode actually do something noticeable in game by injecting some
CSS.

```js
module.exports = {
	id: 'awesome-mod',
	name: 'Awesome Mod',
	description: 'Does some great stuff...',

	version: '1.0.0',
	gameVersion: '1.2.1',
	loaderVersion: '1.1.0',

	getStyles() {
		return `
			.shop > .shopItem,
			.shopPack {
				outline: 5px solid #c9b3ee;
			}

			body > .shop {
				padding-right: 5px;
			}
		`
	}
}
```

This will give a nice light purple outline to the shop cards.

The easiest way to experiment with styling is to use the
[Dev Tools](./00-introduction.md#dev-tools).

> [!NOTE]
>
> You should be specific with your selectors to have higher
> [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity)
> than the native game's code.

## Extra - Add logging

Sometimes you might want to log a message to the console. When doing that you
should create and use logger using the `MOD_TOOLBOX.newModLogger()`.

Here, we'll print a test message when the mod is loaded using the optional
`onLoad` function:

```js
// Move the id into a dedicated variable
// to be reused across multiple places.
const id = 'awesome-mod'

// Create logger for your mod.
const logger = MOD_TOOLBOX.newModLogger(id)

module.exports = {
	// Include our id
	id,
	name: 'Awesome Mod',
	description: 'Does some great stuff...',

	version: '1.0.0',
	gameVersion: '1.2.1',
	loaderVersion: '1.1.0',

	getStyles() {
		return `
			.shop > .shopItem,
			.shopPack {
				outline: 5px solid #c9b3ee;
			}

			body > .shop {
				padding-right: 5px;
			}
		`
	},

	onLoad() {
		logger.log('Loaded successfully!')
	}
}
```

Now when you **reload the game** and open the **Dev Tools** you should see a
message in the **console**:

`[MOD: awesome-mod] Loaded successfully!`

If you're wondering, here are the exact types for the `getStyles` and `onLoad`
functions:

```ts
onLoad?: (mctx: ModContext<S>) => void

getStyles?: (mctx: ModContext<S>) => string
```

## Where to Go Next

You've now see:

- How to structure a minimal mod
- How to run code when the mod loads.
- How to inject styles

From here, you can start experimenting with new features and learning how to
interact with the game's systems.

Next, we'll dive deeper into:

- [Contexts](./03-contexts.md)
- [Settings](./04-settings.md)
- [Updating Codex](./05-updating-codex.md)
- [Patching Methods](./06-patching-methods.md)
