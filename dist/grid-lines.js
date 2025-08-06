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

// src/mods/grid-lines/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var settings = {
  lineColor: {
    type: "string",
    name: "Grid Line Color",
    description: "RBGA hex color for grid lines.",
    default: "#ddddddff",
    sanitize: MOD_TOOLBOX.sanitizers.colorHexRGBA
  },
  lineWidth: {
    type: "number",
    name: "Grid Line Width",
    description: "Width of grid lines in pixels",
    default: 1,
    sanitize: MOD_TOOLBOX.sanitizers.nonNegative
  },
  alternate: {
    type: "boolean",
    name: "Alternate Backgrounds",
    description: "When grid lines are show, render every other cell with a different background color.",
    default: true,
    sanitize: (a) => a
  },
  alternateColor: {
    type: "string",
    name: "Alternate Background Color",
    description: "RBGA hex alternate backround color.",
    default: "#f8f8f8ff",
    sanitize: MOD_TOOLBOX.sanitizers.colorHexRGBA
  },
  tenths: {
    type: "boolean",
    name: "Alternate Background every 10th",
    description: "When grid lines are show, render every other cell with a different background color.",
    default: false,
    sanitize: (a) => a
  },
  tenthColor: {
    type: "string",
    name: "RBGA hex alternate background color for every 10th cell",
    default: "#ddddddff",
    sanitize: MOD_TOOLBOX.sanitizers.colorHexRGBA
  }
};
var gridArea = 70;
var showGrid = false;
var index_default = {
  id: "grid-lines",
  name: "Grid Lines",
  description: 'Toggle visual grid lines by pressing "G"',
  version: "1.0.1",
  gameVersion: "1.2.1",
  loaderVersion: "1.0.0",
  settings,
  getPatches(mctx) {
    return {
      Game: {
        wrap: {
          renderConductors(ctx, dt) {
            if (!showGrid) return ctx.original(dt);
            const self = ctx.self;
            const canvasCtx = ctx.self.ctx;
            const uv = Array.from(self.hoveredCell);
            uv[0] -= uv[0] % 2;
            uv[1] -= uv[1] % 2;
            const range = {
              x: [uv[0] - gridArea + 0.5, uv[0] + gridArea + 0.5],
              y: [uv[1] - gridArea + 0.5, uv[1] + gridArea + 0.5]
            };
            if (mctx.settings.alternate.value) {
              fillAlternateSquares(self, mctx.settings, canvasCtx, range);
            }
            ctx.original(dt);
            drawGridLines(self, mctx.settings, canvasCtx, range);
          }
        }
      }
    };
  },
  onLoad() {
    window.addEventListener("keypress", (event) => {
      if (event.key === "g" && !MOD_TOOLBOX.focusesTextEditableElement())
        showGrid = !showGrid;
    });
  }
};
function drawGridLines(self, settings2, ctx, range) {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = settings2.lineColor.value;
  ctx.lineWidth = settings2.lineWidth.value * self.pixelRatio;
  ctx.lineCap = "square";
  ctx.beginPath();
  for (let x = range.x[0]; x <= range.x[1]; x++) {
    const from = self.uvToXY([x, range.y[0]]);
    const to = self.uvToXY([x, range.y[1]]);
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
  }
  for (let y = range.y[0]; y <= range.y[1]; y++) {
    const from = self.uvToXY([range.x[0], y]);
    const to = self.uvToXY([range.x[1], y]);
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
  }
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
function fillAlternateSquares(self, settings2, ctx, range) {
  ctx.save();
  ctx.fillStyle = settings2.alternateColor.value;
  ctx.beginPath();
  let alternate = false;
  for (let x = range.x[0] + 1; x <= range.x[1]; x++) {
    alternate = !alternate;
    for (let y = range.y[0] + 1; y <= range.y[1]; y++) {
      alternate = !alternate;
      if (alternate) prepareDrawSquare(self, ctx, x, y);
    }
  }
  ctx.fill();
  if (!settings2.tenths.value) {
    ctx.restore();
    return;
  }
  ctx.fillStyle = settings2.tenthColor.value;
  ctx.beginPath();
  for (let x = range.x[0] - (range.x[0] - 0.5) % 10; x <= range.x[1]; x += 10) {
    for (let y = range.y[0] - (range.y[0] - 0.5) % 10; y <= range.y[1]; y += 10) {
      prepareDrawSquare(self, ctx, x, y);
    }
  }
  ctx.fill();
  ctx.restore();
}
function prepareDrawSquare(self, ctx, x, y) {
  const x2 = x - 1;
  const y2 = y - 1;
  const xy0 = self.uvToXY([x, y]);
  const xy1 = self.uvToXY([x, y2]);
  const xy2 = self.uvToXY([x2, y2]);
  const xy3 = self.uvToXY([x2, y]);
  ctx.moveTo(xy0[0], xy0[1]);
  ctx.lineTo(xy1[0], xy1[1]);
  ctx.lineTo(xy2[0], xy2[1]);
  ctx.lineTo(xy3[0], xy3[1]);
}
