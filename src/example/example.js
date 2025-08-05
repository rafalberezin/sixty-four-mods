// A shorter, concise example of a mod written for direct use, without any additional build setup needed
// A mod is just a CommonJs module that exports an object that satisfies the `Mod` type
// This is the plain counterpart of the `example.ts`. For exact explanations read `example.ts` it instead even if you wont't use ts.
// For practical use examples look at real mods.

const updated = Symbol()

const id = 'example-unique-mod-id'

const logger = MOD_TOOLBOX.newModLogger(id)

/** @type {import('../types/modloader').ModSettingsDefinition} */
const settings = {
	exampleNumberSetting: {
		type: 'number',
		name: 'Example number',
		description:
			"A number setting for an example mod, doesn't really do anything",
		default: 1,
		sanitize: (val, def) => (val >= 0 && val <= 10 ? val : def)
	},
	exampleStringSetting: {
		type: 'string',
		name: 'Example string',
		description: "It's just a string setting, But let's take in a color",
		default: '#96ffdc',
		sanitize: MOD_TOOLBOX.sanitizers.colorHexRGB
	},
	exampleBooleanSetting: {
		type: 'boolean',
		name: 'Example boolean',
		default: true,
		sanitize: v => v
	}
}

/** @type {import('../types/modloader').Mod<typeof settings>} */
const mod = {
	id,
	name: 'Example displayed mod name',
	description: 'Mod description',

	version: '1.0.0',
	gameVersion: '1.2.1',
	loaderVersion: '1.0.0',

	settings,

	getPatches(mctx) {
		/** @type {import('../types/modloader').PatchSpec} */
		const patchSpec = {
			Converter13: {
				wrap: {
					render(ctx, dt, vposition) {
						ctx.self.myCustomField +=
							dt * mctx.settings.exampleNumberSetting.value

						return ctx.original(dt, vposition)
					}
				}
			}
		}

		if (mctx.settings.exampleBooleanSetting.value) {
			patchSpec.Exhaust = {
				wrap: {
					render(ctx) {
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

	getStyles(mctx) {
		return `
#my-element-id {
	color: ${mctx.settings.exampleStringSetting.value};
}
`
	},

	updateCodex(mctx, codex) {
		const chasm = codex.entities.chasm
		const priceMult = mctx.settings.exampleNumberSetting.value

		chasm.price = chasm.price.map(value => value * priceMult)
	},

	onLoad(mctx) {
		if (!mctx.settings.exampleBooleanSetting.value) return

		window.addEventListener('keypress', event => {
			if (event.key === 'm' && !MOD_TOOLBOX.focusesTextEditableElement()) {
				logger.log('Hello, the player pressed the "m" key')
			}
		})
	}
}

module.exports = mod
