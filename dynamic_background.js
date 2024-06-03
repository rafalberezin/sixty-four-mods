/*
 * Sixty-Four Mod: Dynamic Background
 *
 * https://sixtyfour.game-vault.net/wiki/Modding:Index
 *
 * ----------------------------------------------
 *
 * REQUIRES THE MOD AUTOLOADER
 * See https://gist.github.com/NamelessCoder/26be6b5db7480de09f9dfb9e80dee3fe#file-_readme-md
 * 
 * REQUIRES THE SPRITE REPLACEMENTS TO GET THE CHANGED BACKGROUND UNDER MACHINES
 * https://github.com/RafalBerezin/Sixty_Four_Mods/blob/master/dynamic_background_sprite_overrides.zip
 * Extract the contents of this zip archive into the mods folder.
 * The folder structure shuold look like this:
 * game/
 * └── mods/
 *     ├── dynamic_background.js
 *     └── db_sprite_overrides/
 *         └── [.png files]
 *
 * ----------------------------------------------
 *
 * Changes the background color.
 * Additionaly allows to easily replace sprites.
 */

const _rgbHexPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

function _sanitizeRbgHex(val, def) {
    if (!(""+val).startsWith("#")) val = "#" + val
    if (!_rgbHexPattern.test(val)) return def;
    if (val.length == 7) return val;
    
    const r = val.charAt(1);
    const g = val.charAt(2);
    const b = val.charAt(3);
    
    return `#${r + r + g + g + b + b}`;
}

module.exports = class DynamicBackground extends Mod {
    label = "Dynamic Background";
    description = "Modify background color.";
    version = "1.0.0";

    replacementsDir = "mods/db_sprite_overrides/";

    settings = {
        backgroundColor: {
            default: "#24242c",
            label: "Background Color",
            description: "Rgb hex for background color.",
            sanitize: _sanitizeRbgHex,
        },
        replaceSprites: {
            default: true,
            label: "Replace Sprites",
            description: 'Replace default sprites with the modified versions.\nYou need to download these with the mod and place them in \'' + this.replacementsDir + '\'.',
        },
    };

    spriteReplacements = {};

    getMethodReplacements() {
        const self = this;
        const options = this.getOptions();

        const methods = [
            {
                class: Game,
                method: "renderloop",
                replacement: function () {
                    requestAnimationFrame(_ => { this.renderloop() });

                    this.unit = this.solidUnit * this.zoom;

                    if (this.halt) return;

                    const now = performance.now();
                    this.renderTime.dt = now - this.renderTime.lt;
                    this.renderTime.lt = now;

                    if (this.slowdown.state) this.renderTime.dt *= (1 * (1 - this.slowdown.f) + this.slowdown.multiplyer * this.slowdown.f);

                    this.ctx.fillStyle = this.plane === 1 ? "#000" : options.backgroundColor;
                    this.ctx.fillRect(0, 0, this.w, this.h);

                    this.ctx.save();
                    this.ctx.translate(this.w2, this.h2);

                    //HIGHLIGHT
                    this.renderConductors(this.renderTime.dt);
                    this.ctx.translate(-this.w2, -this.h2);
                    this.renderChasmVFX();
                    this.ctx.translate(this.w2, this.h2);
                    this.renderEntities(this.renderTime.dt);

                    if (this.altActive && !this.plane) {
                        this.ctx.fillStyle = `${options.backgroundColor}cc`;
                        this.ctx.fillRect(-this.w2, -this.h2, this.w, this.h);

                        if (this.hoveredEntity && !(this.hoveredEntity instanceof Cube)) {
                            this.renderSOI(this.hoveredEntity);
                            this.hoveredEntity.render(0);
                            this.renderAffected(this.hoveredEntity.name);
                        }
                    }

                    if (this.hoveredCell) {
                        if (this.itemInHand) {
                            this.renderAvailability();
                            this.renderSOI(this.hoveredCell);
                        }

                        this.renderHoveredCell();

                        if (this.itemInHand) {
                            this.ctx.save();
                            this.ctx.globalAlpha = .5;
                            this.itemInHand.render(0, this.hoveredCell);
                            this.ctx.restore();
                            this.renderAffected(this.itemInHand.name);    
                        }
                    }

                    //Pinhole
                    if (this.pinhole) {
                        const radius = this.unit * .01 + this.unit * 2 * this.pinhole.f;
                        const time = performance.now() / 1000;
                        const noise = (Math.sin(time * 37) * .6 + Math.sin(time * 1913.2) * .4) * this.unit * .08;
                        const ctx = this.ctx;
                        const xy = this.uvToXY(this.pinhole.position);

                        ctx.save();
                        ctx.translate(xy[0], xy[1] - this.unit);
                        ctx.fillStyle = this.plane ? options.backgroundColor : "#000";

                        ctx.beginPath();
                        ctx.arc(0, 0, Math.max(0, radius + noise), 0, Math.PI * 2);
                        ctx.closePath();

                        ctx.fill();
                        ctx.restore();
                    }

                    this.ctx.restore();

                    this.renderVFX();

                    if (!this.plane) {
                        if (this.chasm) this.renderChasm();
                        this.renderResources();
                        if (!this.chillMode) this.renderHollowEvents();
                        this.renderSlowdown();

                    } else {
                        if (this.entitiesInGame.pinhole > 0) this.renderResources();
                        else this.renderDarkResources();

                        if (!this.chillMode) this.renderDarkHollowEvents();
                    }

                    if (this.mouse.cursorVisible) this.renderCursor();

                    //Hint position update
                    if (this.currentHint.element) {
                        this.currentHint.element.style.left = this.mouse.offsetxy[0] + `px`;
                        this.currentHint.element.style.top = this.mouse.offsetxy[1] + `px`;
                    }

                    if (!self.darkMode && this.photofobia && this.flashlight && !this.plane) {
                        this.ctx.fillStyle = this.flashlight;
                        this.ctx.fillRect(0, 0, this.w, this.h);
                    }
                }
            },
        ];

        if (options.replaceSprites) methods.push(
            {
                class: Sprite,
                method: "switchSequence",
                replacement: function (n) {
                    self.replaceSpriteSource(this);
                    self.originalMethods.Sprite.switchSequence.call(this, n);
                }
            }
        );

        return methods;
    };

    sanitizeOptions() {
        const options = this.getOptions();
        const settings = this.getSettings();

        for (const key in options) {
            const option = this.settings[key];
            if (option.sanitize) options[key] = option.sanitize(options[key], settings[key].default);
        }

        return options;
    }

    calculateBrightness(color) {
        const hex = color.substring(1);
        const rgb = parseInt(hex, 16);

        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        this.darkMode = luma < 128;
    }

    registerSpriteReplacements() {
        const self = this;
        const original_abstract_getCodex = abstract_getCodex;

        abstract_getCodex = function () {
            const codex = original_abstract_getCodex();
            const preloads = codex.preload;
            
            const fs = require("fs");
            const dir = __dirname.endsWith("mods") ? __dirname.substring(0, __dirname.length - 4) : __dirname + "/";

            fs.readdirSync(dir+self.replacementsDir).filter(e => e.endsWith(".png")).forEach(entry => {
                const original = "img/" + entry;
                const replacement = self.replacementsDir + entry;

                const preloadIndex = preloads.indexOf(original);
                if (preloadIndex == -1) preloads.push(replacement);
                else preloads[preloadIndex] = replacement;
                
                self.spriteReplacements[original] = replacement;
            });

            return codex;
        };
    };

    replaceSpriteSource(sprite) {
        if (sprite.replacementDone) return;

        for (const key in this.spriteReplacements) {
            if (!sprite.img.src.endsWith(key)) continue;

            const preloaded = sprite.master.images[key];

            if (preloaded) sprite.img = preloaded;
            else sprite.img.src = this.spriteReplacements[key];

            break;
        }

        sprite.replacementDone = true;
    }

    init() {
        const options = this.sanitizeOptions();
        this.calculateBrightness(options.backgroundColor);
        if (options.replaceSprites) this.registerSpriteReplacements();

        console.log("Dynamic Background was initialized.");
    };
};
