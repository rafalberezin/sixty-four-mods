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
    version = "1.0.0";
    settings = {
        priceBaseMultiplier: {
            default: 1,
            label: "Base Multiplier",
            description: "Scale the base build price.",
            sanitize: _sanitizeNonNegative,
        },
        priceScalingMultiplier: {
            default: 0.5,
            label: "Scaling Multiplier",
            description: "Scale the build price increse rate.\nSet to 0 for constant prices.",
            sanitize: _sanitizeNonNegative,
        },
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

    init() {
        const options = this.sanitizeOptions();

        const original_abstract_getCodex = abstract_getCodex;

        abstract_getCodex = function () {
            const codex = original_abstract_getCodex();

            for (const key in codex.entities) {
                const entity = codex.entities[key];
                if (entity?.priceExponent !== 1) entity.priceExponent = (entity.priceExponent - 1) * options.priceScalingMultiplier + 1;
                if (entity?.price) entity.price = entity.price.map(n => n * options.priceBaseMultiplier);
            }

            return codex;
        };

        console.log("Dynamic Prices was initialized.");
    };
};
