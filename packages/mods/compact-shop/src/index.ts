import { Mod, ModSettingsDefinition } from 'modloader/types'

declare const __VERSION__: string

declare global {
	interface Shop {
		shopToggle: HTMLDivElement
	}
}

const settings = {
	angledPrices: {
		type: 'boolean',
		name: 'Angled Prices',
		description: 'Display the prices at an angle for easier reading',
		default: true,
		sanitize: a => a
	},
	autoMinimize: {
		type: 'boolean',
		name: 'Start Minimized',
		description: 'Start the game with shop minimized',
		default: true,
		sanitize: a => a
	}
} satisfies ModSettingsDefinition

export default {
	id: 'compact-shop',
	name: 'Compact Shop',
	description: 'Make the minimized shop even more compact',

	version: __VERSION__,
	gameVersion: '1.2.1',
	loaderVersion: '1.0.0',

	settings,

	getPatches(mctx) {
		if (!mctx.settings.autoMinimize.value) return {}

		return {
			Shop: {
				observe: {
					init(ctx) {
						ctx.self.shopToggle.click()
					}
				}
			}
		}
	},

	getStyles(mctx) {
		const angled = mctx.settings.angledPrices.value

		const paddingBottom = angled ? '0.8em' : '0.4em'
		const transform = angled ? 'transform: rotate(-30deg);' : ''

		return `
div.shop .shopPack .shopItem:not(.shopItem:not(.hidden) ~ .shopItem) {
	border-top: none;
}

div.shop.minimized {
	--unit: 14px;
	--antiunit: -14px;
}

div.shop.minimized .shopItem {
	padding: 0.4em 1em ${paddingBottom} 0.6em;
	overflow: hidden;
}

div.shop.minimized .shopItem :is(.itemHeader, .itemDescription) {
	position: relative;
	z-index: 1;
}

div.shop.minimized .imageVessel {
	position: absolute;
	top: 0.4em;
	opacity: 25%;
}

div.shop.minimized .itemPrice {
	display: flex;
	flex-direction: row;
}

div.shop.minimized .itemPrice > * {
	display: flex;
	flex-direction: column;
	align-items: center;
	font-weight: 600;
}

div.shop.minimized .shopItem .itemPrice .priceString {
	position: relative;
	margin: 0.5em 0 0;
	writing-mode:  vertical-lr;
	text-orientation: mixed;
	text-shadow: 0 0 5px white;
	z-index: 1;
	transform-origin: top right;
	${transform}
}

div.shop.minimized .shopItem .itemCounter {
	top: 5.6px;
	right: 8.4px;
	font-size: 11.2px;
}

div.shop.minimized .existed {
	inset: auto 0.25em 0.25em auto;
}

div.shop.minimized .shopItem.disabled .itemDescription {
	color: #101010;
}
`
	}
} satisfies Mod<typeof settings>
