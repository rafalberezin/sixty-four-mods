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

// src/mods/improved-silos/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var MOD_ID = "improved-silos";
var originalFuel = Symbol.for(`${MOD_ID}-originalFuel`);
var fillRefund = Symbol.for(`${MOD_ID}-fillRefund`);
var settings = {
  siloCapacityMultiplier: {
    type: "number",
    name: "Underground Silo Fuel Capacity Multiplier",
    description: "How much fuel can the silo hold. Set to 0 for infinite fuel.",
    default: 2,
    sanitize: MOD_TOOLBOX.sanitizers.nonNegative
  },
  siloRefilCostMultiplier: {
    type: "number",
    name: "Underground Silo Refill Cost Multiplier",
    description: "How much refilling the silo costs.",
    default: 1,
    sanitize: MOD_TOOLBOX.sanitizers.nonNegative
  },
  silo2CapacityMultiplier: {
    type: "number",
    name: "Industrial Silo Fuel Capacity Multiplier",
    description: "How much fuel can the silo hold. Set to 0 for infinite fuel.",
    default: 2,
    sanitize: MOD_TOOLBOX.sanitizers.nonNegative
  },
  silo2RefilCostMultiplier: {
    type: "number",
    name: "Industrial Silo Refill Cost Multiplier",
    description: "How much refilling the silo costs.",
    default: 1,
    sanitize: MOD_TOOLBOX.sanitizers.nonNegative
  }
};
var mod = {
  id: MOD_ID,
  name: "Improved Silos",
  description: "Modify refil cost and fuel drain rate of the silos.",
  version: "1.0.0",
  gameVersion: "1.2.1",
  loaderVersion: "1.0.0",
  settings,
  getPatches(mctx) {
    if (Object.values(mctx.settings).every((setting) => setting.value === 1))
      return {};
    return {
      Silo: {
        wrap: {
          initHint(ctx) {
            if (ctx.self[originalFuel] !== void 0) return ctx.original();
            const self = ctx.self;
            const silo2 = self instanceof Silo2;
            const capacityMultiplier = silo2 ? mctx.settings.silo2CapacityMultiplier.value : mctx.settings.siloCapacityMultiplier.value;
            const refilCostMult = silo2 ? mctx.settings.silo2RefilCostMultiplier.value : mctx.settings.siloRefilCostMultiplier.value;
            self[originalFuel] = self.fuel;
            self.fuel = self[originalFuel].map((n) => n * refilCostMult);
            const freeTimer = self.freeTimer;
            const fill = self.fill;
            self[fillRefund] = 0;
            self.freeTimer = -100;
            self.fill = 100;
            self.tap();
            self.fill -= 100;
            self[fillRefund] = -self.fill;
            if (capacityMultiplier !== 0)
              self[fillRefund] *= (capacityMultiplier - 1) / capacityMultiplier;
            self.fill = fill;
            self.freeTimer = freeTimer;
            ctx.original();
          },
          tap(ctx) {
            const self = ctx.self;
            self.fill += self[fillRefund];
            const fill = self.fill;
            ctx.original();
            if (self.fill === fill) self.fill -= self[fillRefund];
          }
        }
      }
    };
  }
};
var index_default = mod;
