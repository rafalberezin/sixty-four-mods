"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/mods/compact-shop/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var settings = {
  angledPrices: {
    type: "boolean",
    name: "Angled Prices",
    description: "Display the prices at an angle for easier reading",
    default: true,
    sanitize: (a) => a
  }
};
var index_default = {
  id: "compact-shop",
  name: "Compact Shop",
  description: "Make the minimized shop even more compact",
  version: "1.0.0",
  gameVersion: "1.2.1",
  loaderVersion: "1.0.0",
  settings,
  getStyles(mctx) {
    const angled = mctx.settings.angledPrices.value;
    const paddingBottom = angled ? "0.8em" : "0.4em";
    const transform = angled ? "transform: rotate(-30deg);" : "";
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
`;
  }
};
