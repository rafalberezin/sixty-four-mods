/*
 * Sixty-Four Mod: No HUD
 *
 * https://sixtyfour.game-vault.net/wiki/Modding:Index
 *
 * ----------------------------------------------
 *
 * REQUIRES THE MOD AUTOLOADER
 * See https://gist.github.com/NamelessCoder/26be6b5db7480de09f9dfb9e80dee3fe#file-_readme-md
 *
 * ----------------------------------------------
 *
 * Allows to hide the HUD.
 */

module.exports = class NoHUD extends Mod {
    label = "No HUD";
    description = "Press [H] to hide the HUD";
    version = "1.0.0";
    settings = {
        hideResources: {
            default: true,
            label: "Hide Resources",
            description: "Hide the Resource Bar, Resource Transfer and Chasm vfx."
        },
        hideCursor: {
            default: false,
            label: "Hide Cursor",
            description: "Hide the Cursor and related visuals."
        }
    };

    hiddenClass = "no-hud";
    styles = `
        .${this.hiddenClass} {
            visibility: hidden;
            pointer-events: none;
        }
    `;

    toggleKey = "h";

    hidden = false;
    htmlHUDElements = undefined;
    htmlHUDElementSelectors = [".shop", ".shopToggle", ".chatIcon", ".messenger"];

    getMethodReplacements() {
        const self = this;
        const options = this.getOptions();

        const methods = [
            {
                class: Game,
                method: "setListeners",
                replacement: function () {
                    self.game = this;
                    self.addListeners();
                    self.originalMethods.Game.setListeners.call(this);
                }
            }
        ];

        if (options.hideResources) {
            methods.push(
                {
                    class: Game,
                    method: "renderChasm",
                    replacement: function () {
                        if (self.hidden) return;
                        self.originalMethods.Game.renderChasm.call(this);
                    }
                },
                {
                    class: Game,
                    method: "renderResources",
                    replacement: function () {
                        if (self.hidden) return;
                        self.originalMethods.Game.renderResources.call(this);
                    }
                },
                {
                    class: Game,
                    method: "renderVFX",
                    replacement: function () {
                        if (self.hidden) return;
                        self.originalMethods.Game.renderVFX.call(this);
                    }
                }
            );
        }

        if (options.hideCursor) {
            methods.push(
                {
                    class: Game,
                    method: "renderCursor",
                    replacement: function () {
                        if (self.hidden) return;
                        self.originalMethods.Game.renderCursor.call(this);
                    }
                },
                {
                    class: Game,
                    method: "renderSOI",
                    replacement: function (entity) {
                        if (self.hidden) return;
                        self.originalMethods.Game.renderSOI.call(this, entity);
                    }
                },
                {
                    class: Game,
                    method: "renderAffected",
                    replacement: function (name) {
                        if (self.hidden) return;
                        self.originalMethods.Game.renderAffected.call(this, name);
                    }
                }
            );
        }

        return methods;
    };

    addListeners() {
        window.addEventListener('keyup', e => this.toggleHUDEvent(e));
    }

    toggleHUDEvent(e) {
        if (e.key.toLowerCase() !== this.toggleKey || this.game.splash.isShown ) return;

        this.hidden = !this.hidden;

        this.getHUDHtmlElements().forEach(element => {
            element.classList.toggle(this.hiddenClass, this.hidden);
        });

        if (this.hidden) this.game.removeHint();
    }

    getHUDHtmlElements() {
        if (this.htmlHUDElements) return this.htmlHUDElements;
        
        this.htmlHUDElements = this.htmlHUDElementSelectors.map(selector => document.querySelector(selector)).filter(e => e);
        return this.htmlHUDElements;
    }
};
