import type { CodexEntity } from '../../types/game'
import type { Mod, ModSettingsDefinition } from '../../types/modloader'

const settings = {
	priceBaseMultiplier: {
		type: 'number',
		name: 'Price Multiplier',
		description: 'Scale the base build price',
		default: 1,
		sanitize: MOD_TOOLBOX.sanitizers.nonNegative
	},
	priceExponentMultiplier: {
		type: 'number',
		name: 'Price Scaling Multiplier',
		description:
			'Scale the build price increase rate.\nSet to 0 for constant prices.',
		default: 0.5,
		sanitize: MOD_TOOLBOX.sanitizers.nonNegative
	}
} satisfies ModSettingsDefinition

const mod = {
	id: 'dynamic-prices',
	name: 'Dynamic Prices',
	version: '2.0.0',
	description: 'Modify build prices',

	gameVersion: '1.2.1',
	loaderVersion: '1.0.0',

	settings,

	updateCodex(mctx, codex) {
		const baseMult = mctx.settings.priceBaseMultiplier.value
		const exponentMult = mctx.settings.priceExponentMultiplier.value

		if (baseMult !== 1) {
			for (const entity of Object.values(
				codex.entities
			) as CodexEntity<Entity>[]) {
				entity.price = entity.price.map(price => Math.ceil(price * baseMult))
			}
		}

		if (exponentMult !== 1) {
			for (const entity of Object.values(
				codex.entities
			) as CodexEntity<Entity>[]) {
				if (entity.priceExponent === undefined || entity.priceExponent === 1)
					continue
				entity.priceExponent = (entity.priceExponent - 1) * exponentMult + 1
			}
		}
	}
} satisfies Mod<typeof settings>

export default mod
