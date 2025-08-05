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
var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

// src/mods/dynamic-prices/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var settings = {
  priceBaseMultiplier: {
    type: "number",
    name: "Price Multiplier",
    description: "Scale the base build price",
    default: 1,
    sanitize: MOD_TOOLBOX.sanitizers.nonNegative
  },
  priceExponentMultiplier: {
    type: "number",
    name: "Price Scaling Multiplier",
    description: "Scale the build price increase rate.\nSet to 0 for constant prices.",
    default: 0.5,
    sanitize: MOD_TOOLBOX.sanitizers.nonNegative
  }
};
var mod = {
  id: "dynamic-prices",
  name: "Dynamic Prices",
  version: "2.0.0",
  description: "Modify build prices",
  gameVersion: "1.2.1",
  loaderVersion: "1.0.0",
  settings,
  updateCodex(mctx, codex) {
    const baseMult = mctx.settings.priceBaseMultiplier.value;
    const exponentMult = mctx.settings.priceExponentMultiplier.value;
    if (baseMult !== 1) {
      for (const entity of Object.values(
        codex.entities
      )) {
        entity.price = entity.price.map((price) => Math.ceil(price * baseMult));
      }
    }
    if (exponentMult !== 1) {
      for (const entity of Object.values(
        codex.entities
      )) {
        if (entity.priceExponent === void 0 || entity.priceExponent === 1)
          continue;
        entity.priceExponent = (entity.priceExponent - 1) * exponentMult + 1;
      }
    }
  }
};
var index_default = mod;
