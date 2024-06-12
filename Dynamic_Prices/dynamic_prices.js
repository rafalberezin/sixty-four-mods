/*
 * Sixty-Four Mod: Dynamic Prices
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
 * Scales the base and increase rate of build prices.
 */

function _sanitizeNonNegative(val, def) {
    if (typeof val !== "number") return def;
    return val < 0 ? 0 : val;
}

module.exports = class DynamicPrices extends Mod {
    label = "Dynamic Prices";
    description = "Modify build prices.";
    version = "1.1.0";
    settings = {
        priceBaseMultiplier: {
            default: 1,
            label: "Base Multiplier",
            description: "Scale the base build price.",
            sanitize: _sanitizeNonNegative,
        },
        priceExponentMultiplier: {
            default: 0.5,
            label: "Scaling Multiplier",
            description: "Scale the build price increse rate.\nSet to 0 for constant prices.",
            sanitize: _sanitizeNonNegative,
        },
    };

    initializeOptions() {
        super.initializeOptions();
        this.sanitizeOptions();
    };

    sanitizeOptions() {
        const options = this.getOptions();
        const settings = this.getSettings();

        for (const key in options) {
            const setting = this.settings[key];
            if (setting?.sanitize) options[key] = setting.sanitize(options[key], settings[key].default);
        }
    }

    updateCodex() {
        const self = this;
        const original_abstract_getCodex = abstract_getCodex;

        abstract_getCodex = function () {
            const codex = original_abstract_getCodex();

            for (const key in codex.entities) {
                self.applyMultipliers(codex.entities[key]);
            }

            return codex;
        };
    }

    applyMultipliers(entity) {
        if (entity.dynamicPricesApplied) return;
        const options = this.getOptions();

        if (entity.priceExponent !== 1 && options.priceExponentMultiplier !== 1) entity.priceExponent = (entity.priceExponent - 1) * options.priceExponentMultiplier + 1;
        if (entity.price && options.priceBaseMultiplier !== 1) entity.price = entity.price.map(n => n * options.priceBaseMultiplier);

        entity.dynamicPricesApplied = true;
    }

    init() {
        this.updateCodex();
        console.log("Dynamic Prices was initialized.");
    };
};
