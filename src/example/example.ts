// The mods are a CommonJS modules exporting an object that satisfies the Mod interface
// This means that this example needs to be transpiled to CommonJS

import { Mod, ModSettingsDefinition, PatchSpec } from '../types/modloader'

// augmenting game class types to include custom fields
// also do that for fields from the game you want to use, as it's too much for me to define all of them
declare global {
	interface Converter13 {
		myCustomField: number // custom field
	}

	interface Exhaust {
		color: string // game provided field

		[updated]: true // unique symbol used for a custom field
	}
}

// symbol definition for a unique custom field
const updated = Symbol()

// A unique id for our mod.
// If it's repeated with any other mod, both will not load.
const id = 'example-unique-mod-id'

// The globally available readonly `MOD_TOOLBOX` contains usefull modding tools.
// One of which allows us to create a dedicated logger for our mod.
// Currently it doesn't add much functionality beyond automatic prefixing,
// but I'd urge you to use it instead of regular `console.log()`
// as I might extend it's functionality in the future with custom features
// like automatic log file, etc.
const logger = MOD_TOOLBOX.newModLogger(id)

const settings = {
	exampleNumberSetting: {
		// the name and description are only for displaying in the settigns menu
		name: 'Example number',
		description:
			"A number setting for an example mod, doesn't really do anything",

		// type of the default field and both arguments and return type of the sanitizer
		// must match what was specified in the `type` field above
		type: 'number',
		default: 1,

		// this is a function receiving the currently saved value and your default. If no value is saved you get the default for both arguments
		// you can process it however you want to ensure the value is not broken for what you're doing, but you must return a value of the same type
		sanitize: (savedVal, defaultVal) => {
			// do some stuff here
			if (savedVal >= 0 && savedVal <= 10) {
				return savedVal
			}
			return defaultVal
		}
	},

	exampleStringSetting: {
		type: 'string',
		name: 'Example string',
		description: "It's just a string setting. But let's take in a color",

		default: '#96ffdc',

		// There are some predefined sanitizers you can use in the globally available MOD_TOOLBOX
		// just make sure you're referencing it, not calling it instantly
		sanitize: MOD_TOOLBOX.sanitizers.colorHexRGB
	},

	exampleBooleanSetting: {
		type: 'boolean',
		name: 'Example boolean',
		// description is optional, but still good to have
		default: true,
		// can't really be invalid so just return it as is
		sanitize: saved => saved
	}
} satisfies ModSettingsDefinition // use `satisfies ModSettingsDefinition` to keep the exact type for use in Mod type hints

export default {
	id,
	name: 'Example displayed mod name',
	description: 'Mod description',

	version: '1.0.0',
	gameVersion: '1.2.1', // checked for the exact match
	loaderVersion: '1.0.0', // minimum required modloader version

	settings,

	// This function returns the patch specification for your mod.
	//
	// the ModContext currently only contains your processed settings
	// the context is readonly
	getPatches(mctx) {
		// use your setting values for the patch logic

		const patchSpec: PatchSpec = {
			// you should get type hints for available classes inside the `PatchSpec`, for example `Converter13`
			Converter13: {
				// then inside you can specify 3 types of patches
				// you can ommit specifying these groups if they are empty

				// this one completely replaces the method of the class.
				// because only one mod can effectively do that per method
				// multiple mods replacing the same method are considered incompatible
				replace: {}, // empty so definition is not needed, but kept for the example

				// this one wraps around the original method
				// allowing you to modify the arguments it takes and the value it returns and run any other additional code.
				// additionally in the context argument you are given the `original` method
				// and you are REQUIRED to call it inside your patch
				wrap: {
					// inside the patch type group you should get type hints for the available methods

					// these take a readonly patch context object, and all the arguments the original method takes
					render(ctx, dt, vposition) {
						// for consistency of use, you cannot directly use `this` to reference the current instance of the class
						// instead you are given it as a field of the context object called `self`

						// to get the type hints, and stop ts from complaining about this field not existing
						// augment the type of the class inside your mod as shown at the top of the file (see line 6)
						ctx.self.myCustomField +=
							dt * mctx.settings.exampleNumberSetting.value

						// run some code there
						// or modify the arguments

						// then call the original you're given
						const ret = ctx.original(dt, vposition)

						// run some more code there
						// or modify the return value

						// then return it
						return ret
					}
				},

				// this one will run after the method has executed, and will receive the arguments it received,
				// and the value it will return
				observe: {} // empty so definition is not needed, but kept for the example
			}
		}

		// or even use the settings to decide which patches need to be applied
		if (mctx.settings.exampleBooleanSetting.value) {
			patchSpec.Exhaust = {
				wrap: {
					render(ctx) {
						// you should avoid using generic names for your custom fields to avoid clashes with other mods
						// and even better you might want to use symbols which are ensured to be unique (see line 20)
						if (ctx.self[updated]) {
							ctx.self[updated] = true
							ctx.self.color = mctx.settings.exampleStringSetting.value
						}

						ctx.original()
					}
				}
			}
		}

		return patchSpec
	},

	// This function you can add new css styling to the game by returning it as a string.
	//
	// You receive the same ModContext as in getPatches.
	getStyles(mctx) {
		return `
#my-element-id {
	color: ${mctx.settings.exampleStringSetting.value};
}
`
	},

	// This function allows you to modify the game's codex.
	updateCodex(mctx, codex) {
		const chasm = codex.entities.chasm
		const priceMult = mctx.settings.exampleNumberSetting.value

		chasm.price = chasm.price.map(value => value * priceMult)
	},

	// This function allows you to execute any arbitrary code once everything else is loaded
	onLoad(mctx) {
		if (!mctx.settings.exampleBooleanSetting.value) return

		// For example we can create a keybind that logs a message.
		window.addEventListener('keypress', event => {
			// The `isInsideTextEditableElement` method of the toolbox checks
			// whether the user is currently focusing an element inside which they can write.
			// We can use that to not run our keybind in that case.
			if (event.key === 'm' && !MOD_TOOLBOX.focusesTextEditableElement()) {
				logger.log('Hello, the player pressed the "m" key')
			}
		})
	}

	// give the type of your settigns object to the Mod type generic param
	// to get exact type hints for the received contexts containing the processed settings
} satisfies Mod<typeof settings>

// this is more of an explanation on how to use it
// for actual better use examples, and less explanation see the `src/mods/` dir
// where I remade some of the old mods with the new loader
