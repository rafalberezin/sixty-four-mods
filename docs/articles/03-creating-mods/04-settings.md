# Settings

Mods can specify setting for players to configure.

The optional `settings` field of the mod is an object which describes what
settings are available.

The keys of that objects will be later used to access the values from the
[Mod Context](./03-contexts.md#mod-context).

```js
module.exports = {
	// Required fields...

	settings: {
		yourSetting: {
			// Setting definition
		},
		anotherSetting: {
			// ...
		}
	}
}
```

## Setting Definition

Each setting definition specifies:

| Name          | Type         | Description                                 | Required |
| ------------- | ------------ | ------------------------------------------- | :------: |
| `type`        | `string`     | Name of the type of this setting.           |    ✓     |
| `name`        | `string`     | Name displayed in the settings menu.        |    ✓     |
| `description` | `string`     | Description displayed in the settings menu. |          |
| `default`     | matches type | Default value for the setting.              |    ✓     |
| `sanitize`    | `function`   | Function that processes the saved setting.  |    ✓     |

## Setting Types

Currently there are 3 setting types available:

- `string`
- `number`
- `boolean`

## Setting Sanitizers

The `sanitize` field of the setting definition is a sanitizer function.

```ts
type SettingSanitizer<SettingType> = (
	savedVal: SettingType,
	defaultVal: SettingTypes
) => SettingType
```

It receives the **currently saved** and the **default value** values, and must
return a value of the same type.

Use it to fix any potential error in the value configured by the user. For
example you might want to limit a number to at most `10`, then you could do:

```js
sanitize: (val, def) => {
	if (val > 10) {
		return 10
	}

	return val
}
```

The globally available [`MOD_TOOLBOX`](./01-what-are-mods.md#mod-toolbox)
contains some predefined sanitizers for you to use.

For example, if you don't allow a number to be negative:

```js
sanitize: MOD_TOOLBOX.sanitizers.nonNegative
```

## Accessing the values

Functions that receive the [Mod Context](./03-contexts.md#mod-context), can use
the configured values to decide what needs to be done and how.

The Mod Context objects contains a `settings` object, which in turn contains
your defined settings using the same names.

These individual setting objects contain 2 fields each:

- `type`: same as in the setting definition
- `value`: the sanitized value for the setting

For example if you defined:

```js
settings: {
	mySpecialSetting: {
		type: 'number',
		// Other required fields...
	}
}
```

Then your mod context would look like this:

```js
{
	settings: {
		mySpecialSetting: {
			type: 'number'
			value: 4.5 // Example value configured by the player (after sanitization)
		}
	}
}
```

## Usage Example

Building off of the previous examples, here's an updated version which allows
players to configure the color of the shop card outline.

```js
const id = 'awesome-mod'
const logger = MOD_TOOLBOX.newModLogger(id)

module.exports = {
	id,
	name: 'Awesome Mod',
	description: 'Does some great stuff...',

	version: '1.0.0',
	gameVersion: '1.2.1',
	loaderVersion: '1.1.0',

	settings: {
		// Let's call it "outlineColor" internally.
		// We'll later use this name to access it's value.
		outlineColor: {
			type: 'string',
			name: 'Outline Color',
			description: 'Color for the shop cards outline. (RGB hex)',

			// Default to our light purple.
			default: '#c9b3ee',

			// Here we can use the predefined color sanitizer
			// From the globally available MOD_TOOLBOX.
			sanitize: MOD_TOOLBOX.sanitizers.colorHexRGB
		}
	},

	// This function receives the ModContext object,
	// named "mctx" here for brevity.
	//
	// The function reads the configured value of our "outlineColor" setting
	// then inserts it into the CSS in place of the outline color.
	getStyles(mctx) {
		return `
			.shop > .shopItem,
			.shopPack {
				outline: 5px solid ${mctx.settings.outlineColor.value};
			}

			body > .shop {
				padding-right: 5px;
			}
		`
	},

	// We also receive the ModContext in the "onLoad" function,
	// meaning that we can do something else with it after the mod is loaded.
	onLoad(mctx) {
		logger.log('Loaded successfully!')

		// Let's log the whole context object
		// to inspect it during the development.
		logger.log('Mod Context:', mctx)
	}
}
```

Now **Reload** the game, go into the **Settings Menu** and a color setting
should appear. Change and save it, for example you can use `#a0f7a2` for a light
green color. Now the the outline color should be changed.

## Next

- [Updating Codex](./05-updating-codex.md)
- [Updating Words](./06-updating-words.md)
- [Patching Methods](./07-patching-methods.md)
