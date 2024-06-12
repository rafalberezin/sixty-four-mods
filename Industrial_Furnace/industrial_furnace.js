/*
 * Sixty-Four Mod: Industrial Furnace
 *
 * https://sixtyfour.game-vault.net/wiki/Modding:Index
 *
 * ----------------------------------------------
 *
 * REQUIRES THE MOD AUTOLOADER
 * See https://gist.github.com/NamelessCoder/26be6b5db7480de09f9dfb9e80dee3fe#file-_readme-md
 *
 * REQUIRES CUSTOM SPRITES
 * https://github.com/RafalBerezin/Sixty_Four_Mods/blob/master/Industrial_Furnace/industrial_furnace_sprites.zip
 * Extract the contents of this zip archive into the mods folder.
 * The folder structure shuold look like this:
 * 
 * mods/
 * ├── industrial_furnace.js
 * └── img/
 *     ├── industrial_furnace.png
 *     └── shop/
 *         └── industrial_furnace.jpg
 * 
 * ----------------------------------------------
 *
 * Adds an Industrial Furnace, a more efficient version of Beta-Pylene Oxidizer.
 * 
 * IMPORTANT
 * All Industrial Furnaces will disappear without returning the resources if you start the game without this mod enabled.
 */

const registryName = "industrial_furnace";
const entitySpriteSrc = `mods/img/${registryName}.png`;

class IndustrialFurnace extends Entity {
    name = registryName;
    fill = 0;
    conversion = 0;
    baseConversionSpeed = 25e-6;
    state = 0;
    fuel = [0, 0, 0, 65536, 0, 1024, 16384];
    result = [524288, 65536, 32768];
    soulPower = 128;

    src = entitySpriteSrc;

    constructor(master) {
        super(master);

        this.sprite = new Sprite({
            master: this.master,
            src: this.src,
            mask: [0, 0, 455, 730],
            frames: [[0, 0, 455, 730], [455, 0, 455, 730]],
            origins: [227, 600],
            scale: 1,
            sequences: [0, 1],
            intervals: 100
        });

        this.initHint();
        this.initSellHint();
    }

    getConversionOutput() {
        return this.result;
    }

    update(dt) {
        this.checkHarvest(dt);
        this.updateConversionProgress(dt);

        if (this.conversion > 0 && this.sprite.currentSequence === 0) this.sprite.switchSequence(1);
    }

    checkHarvest(dt) {
        if (!this.timeToHarvest) return;

        this.timeToHarvest -= dt;
        if (this.timeToHarvest > 0) return;

        this.harvest();
        delete this.timeToHarvest;
    }

    harvest() {
        this.shootExhaust();

        const screenxy = this.master.uvToXYUntranslated(this.position);
        const pan = this.master.getPanValueFromX(screenxy[0]);
        const loudness = this.master.getLoudnessFromXY(screenxy);

        this.master.createResourceTransfer(this.getConversionOutput(), screenxy);
        this.master.playSound("break", pan, loudness);
        this.master.playSound("tap1", pan, loudness);
    }

    updateConversionProgress(dt) {
        if (this.state !== 2) return;

        const multiplicator = this.preheaters.reduce((acc, preheater) => acc + preheater.tap(), 1);
        this.conversion += this.baseConversionSpeed * dt * multiplicator;

        if (this.conversion < 1) return;

        this.state = 0;
        this.conversion = 0;
        this.fill = 0;
        this.master.activeConverters.delete(this);
        this.sprite.switchSequence(0);
        this.timeToHarvest = Math.random() * 512;
    }

    refill() {
        if (this.state !== 0) return;
        const resources = this.master.requestResources(this.fuel, this.position, _ => this.activate());
        if (resources) this.state = 1;
    }

    activate() {
        this.fill = 1;
        this.state = 2;
        this.sprite.switchSequence(1);
        this.master.activeConverters.add(this);
    }

    onDelete() {
        this.master.activeConverters.delete(this);
    }

    onmousedown() {
        this.refill();
    }

    init() {
        this.preheaters = [];
        this.isNextToSilo = false;

        this.loopSoi(cell => {
            if (cell instanceof Preheater) return this.preheaters.push(cell);
            if (cell instanceof Silo) this.isNextToSilo = true;
        });
    }

    loopSoi(callback) {
        const x = this.position[0];
        const y = this.position[1];

        for (let i = 0; i < this.soi.length; i++) {
            const dx = this.soi[i][0];
            const dy = this.soi[i][1];
            const pos = [x + dx, y + dy];

            const cell = this.master.entityAtCoordinates(pos);
            if (cell) callback(cell);
        }
    }

    render(_, vposition) {
        const position = vposition ? vposition : this.position;
        this.sprite.renderState(position, 0);

        if (!this.conversion) return;

        const ctx = this.master.ctx;
        ctx.save();

        ctx.globalAlpha = Math.min(this.conversion * 10, 1);
        this.sprite.renderState(position, 1);

        ctx.restore();
    }
}

const codexEntry = {
    class: IndustrialFurnace,
    price: [4096, 0, 0, 524288, 1024, 4096, 1048576],
    priceExponent: 1.8,
    canPurchase: true,
    isUpgradeTo: "converter41",
    affected: { silo: true, silo2: true, preheater: true },
    shouldUnlock: m => m.entitiesInGame.converter64 > 0,
    merge: true,

    modded: {
        shopImageSrc: "mods/img/shop/industrial_furnace.jpg",
    }
}

const wordsEntry = {
    name: "Industrial Furnace",
    description: "Effitiently burns huge amounts of Beta-Pylene with Celestial Foam to produce Charonite and trace amounts of other elements."
}

module.exports = class IndustrialFurnaceMod extends Mod {
    label = 'Industrial Furnace';
    description = 'Adds a more efficient way to convert Beta-Pylene to Charonite';
    version = '1.0.0';

    getMethodReplacements() {
        const self = this;

        const methods = [
            {
                class: Shop,
                method: "addItem",
                replacement: function (params) {
                    const entity = this.master.codex.entities[params.id];
                    if (entity && entity.modded) return self.addModdedShopItem(this, entity, params);

                    self.originalMethods.Shop.addItem.call(this, params);
                }
            }
        ];

        return methods;
    };

    addModdedShopItem(shop, entity, params) {
        const { item, imageVessel, image, header, description, price, counter, existed } = this.createShopItemContainer();

        image.src = entity.modded.shopImageSrc;
        header.innerText = params.name;
        description.innerText = params.description;
        existed.innerText = shop.master.words.random.existed;

        this.addShopItemUpgradeInfo(shop, imageVessel, entity);

        params.vessel.appendChild(item);

        item.onmousedown = _ => {
            shop.master.pickupItem(params.id);
            shop.master.processMousemove();
        }

        shop.items.push({
            html: item,
            pack: params.vessel.classList.contains("shopPack") ? params.vessel : false,
            priceHtml: price,
            price: params.price,
            priceExponent: params.priceExponent,
            name: params.id,
            counter,
            existed
        })
    }

    createShopItemContainer() {
        const item = document.createElement("div");
        item.classList.add("shopItem", "hidden");

        const imageVessel = document.createElement("div");
        imageVessel.classList.add("imageVessel")
        item.appendChild(imageVessel);

        const image = document.createElement("img");
        imageVessel.appendChild(image);

        const header = document.createElement("div");
        header.classList.add("itemHeader");
        item.appendChild(header);

        const description = document.createElement("div");
        description.classList.add("itemDescription");
        item.appendChild(description);

        const price = document.createElement("div");
        price.classList.add("itemPrice");
        item.appendChild(price);

        const counter = document.createElement("div");
        counter.classList.add("itemCounter");
        item.appendChild(counter);

        const existed = document.createElement("div");
        existed.classList.add("existed");
        item.appendChild(existed);

        return { item, imageVessel, image, header, description, price, counter, existed };
    }

    addShopItemUpgradeInfo(shop, imageVessel, entity) {
        const baseEntityId = entity.isUpgradeTo;
        if (!baseEntityId) return;

        const baseEntity = shop.master.codex.entities[baseEntityId];
        if (!baseEntity) return;

        const upBox = document.createElement("div");
        upBox.classList.add("upgradeFrom");
        imageVessel.appendChild(upBox);

        const src = baseEntity.modded?.shopImageSrc ?? `${baseEntity.modded ? "mods/" : ""}img/shop/${baseEntityId}.jpg`;
        upBox.style.backgroundImage = `url("${src}")`;
    }

    registerEntity() {
        const original_abstract_getCodex = abstract_getCodex;
        abstract_getCodex = function () {
            const codex = original_abstract_getCodex();

            codex.entities[registryName] = codexEntry;
            codex.preload.push(entitySpriteSrc);

            return codex;
        };

        const original_abstract_getWords = abstract_getWords;
        abstract_getWords = function () {
            const words = original_abstract_getWords();
            words.en.entities[registryName] = wordsEntry;
            return words;
        }
    }

    handleDynamicPrices() {
        const dp = this.mods.dynamic_prices;
        if (!dp || !dp.enabled) return;

        const options = dp.settings;

        if (options.priceExponentMultiplier !== 1) codexEntry.priceExponent = (codexEntry.priceExponent - 1) * options.priceExponentMultiplier + 1;
        if (options.priceBaseMultiplier !== 1) codexEntry.price = codexEntry.price.map(n => n * options.priceBaseMultiplier);

        codexEntry.dynamicPricesApplied = true;
    }

    init() {
        this.registerEntity();
        this.handleDynamicPrices();
    };
};
