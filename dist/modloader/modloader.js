"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/modloader/ui/element.ts
  function createElement(tag, id, classes, innerText) {
    const element = document.createElement(tag);
    if (id) element.id = id;
    if (classes) element.classList.add(...classes);
    if (innerText) element.innerText = innerText;
    return element;
  }

  // src/modloader/ui/style.ts
  var Z_INDEX = {
    loader: "20",
    settings: "10",
    splash: "0"
  };
  var STYLE_VARS = {
    duration: {
      transition: "--ml-duration-transition",
      loaderFadeOut: "--ml-duration-loader-fadeout"
    },
    color: {
      text: "--ml-text-color",
      fadedText: "--ml-text-faded-color",
      neutral: "--ml-neutral",
      green: "--ml-green",
      yellow: "--ml-yellow",
      red: "--ml-red",
      background: {
        base: "--ml-bg-base",
        neutral: "--ml-bg-neutral",
        green: "--ml-bg-green",
        yellow: "--ml-bg-yellow",
        red: "--ml-bg-red"
      }
    }
  };
  var sharedStyle = `
#modloader-root {
	position: absolute;
	width: 0 !important;
	height: 0 !important;
	top: 0 !important;
	left: 0 !important;
	color: var(${STYLE_VARS.color.text});
	font-family: 'Montserrat';
	z-index: 1000;
	isolation: isolate;

	${STYLE_VARS.duration.transition}: 150ms;

	${STYLE_VARS.color.text}: #eeeeee;
	${STYLE_VARS.color.fadedText}: #bbbbbb;

	${STYLE_VARS.color.neutral}: #2c2c3d;
	${STYLE_VARS.color.green}: #4aac32;
	${STYLE_VARS.color.yellow}: #bb8437;
	${STYLE_VARS.color.red}: #99232f;

	${STYLE_VARS.color.background.base}: #101010;
	${STYLE_VARS.color.background.neutral}: color-mix(in oklab, var(${STYLE_VARS.color.neutral}) 20%, var(${STYLE_VARS.color.background.base}));
	${STYLE_VARS.color.background.green}: color-mix(in oklab, var(${STYLE_VARS.color.green}) 20%, var(${STYLE_VARS.color.background.base}));
	${STYLE_VARS.color.background.yellow}: color-mix(in oklab, var(${STYLE_VARS.color.yellow}) 10%, var(${STYLE_VARS.color.background.base}));
	${STYLE_VARS.color.background.red}: color-mix(in oklab, var(${STYLE_VARS.color.red}) 10%, var(${STYLE_VARS.color.background.base}));
}

#modloader-root > * {
	position: fixed !important;
}

#modloader-root, #modloader-root :is(*, *::before, *::after) {
	margin: 0;
	box-sizing: border-box;
}

.ml-column {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.ml-overlay {
	display: grid;
	place-content: center;
	gap: 1rem;
	position: absolute;
	width: 100vw;
	height: 100vh;
	padding: 1rem;
	background-color: var(${STYLE_VARS.color.background.base});
	overflow-y: auto;
}

.ml-button {
	display: block;
	padding: 1rem 2rem;
	width: fit-content;
	background-color: var(${STYLE_VARS.color.neutral});
	color: var(${STYLE_VARS.color.text});
	letter-spacing: 1px;
	text-transform: uppercase;
	border: none;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: filter var(${STYLE_VARS.duration.transition}) ease-out;
}

.ml-button:hover {
	filter: brightness(1.2);
}

.ml-container {
	padding: 1rem;
	background-color: var(${STYLE_VARS.color.background.neutral});
	border: 1px solid var(${STYLE_VARS.color.neutral});
	border-radius: 0.5rem;
}

.ml-container.ml-green {
	background-color: var(${STYLE_VARS.color.background.green});
	border-color: var(${STYLE_VARS.color.green});
}

.ml-container.ml-yellow {
	background-color: var(${STYLE_VARS.color.background.yellow});
	border-color: var(${STYLE_VARS.color.yellow});
}

.ml-container.ml-red {
	background-color: var(${STYLE_VARS.color.background.red});
	border-color: var(${STYLE_VARS.color.red});
}

.ml-heading {
	text-align: center;
	font-weight: normal;
	letter-spacing: 1px;
}

.ml-scroll {
	overflow-y: auto;
}

.ml-scroll::-webkit-scrollbar {
    width: 1.2rem;
}

.ml-scroll::-webkit-scrollbar-track {
    background-color: #ffffff10;
    background-clip: content-box;
    border-radius: 0.6rem;
    border: 0.25rem solid transparent;
}

.ml-scroll::-webkit-scrollbar-thumb {
    background-color: var(${STYLE_VARS.color.text});
    background-clip: content-box;
    border-radius: 0.6rem;
    border: 0.25rem solid transparent;
    cursor: pointer;
}

.ml-input {
	padding: 0.5rem;
	background-color: var(${STYLE_VARS.color.background.neutral});
	border: 1px solid var(${STYLE_VARS.color.neutral});
	border-radius: 0.5rem;
	color: var(${STYLE_VARS.color.text});
}
`;
  var loaderStyles = [sharedStyle];
  function registerStyle(style) {
    loaderStyles.push(style);
  }
  function getStyles() {
    return loaderStyles.map((s) => s.trim()).join("\n\n");
  }
  function appendStyle(style, source) {
    const element = createElement("style");
    element.innerHTML = style;
    element.dataset.source = source;
    document.head.appendChild(element);
    return element;
  }
  function loadStyles(mods) {
    setLoaderStatus("Applying mod styles");
    for (const mod of mods) {
      if (mod.definition.getStyles === void 0) continue;
      try {
        const styles = mod.definition.getStyles(mod.mctx);
        if (typeof styles !== "string") throw new Error("Not a string");
        mod.styles = styles.trim();
      } catch (e) {
        addLoaderError({
          source: "external",
          severity: "error",
          summary: `An error occured while loading styles for mod "${mod.definition.name}".`,
          details: [e instanceof Error ? e.message : String(e)]
        });
        continue;
      }
      appendStyle(mod.styles, mod.definition.id);
    }
  }

  // src/modloader/ui/main.ts
  var MODLOADER_UI_ROOT = createElement("div", "modloader-root");
  function initializeUI() {
    appendStyle(getStyles(), "[modloader-builtin]");
    window.addEventListener("DOMContentLoaded", () => {
      document.body.appendChild(MODLOADER_UI_ROOT);
    });
  }

  // src/modloader/utils/version.ts
  var LOADER_VERSION = [1, 0, 0];
  var TARGET_GAME_VERSION = [1, 2, 1];
  var VERSIONS = {
    loader: versionFromArray(LOADER_VERSION),
    gameTarget: versionFromArray(TARGET_GAME_VERSION)
  };
  function versionFromArray(version) {
    return { arr: version, str: version.join(".") };
  }
  var SIMPLE_VERSION_REGEX = /^v?(\d+)\.(\d+)\.(\d+).*$/;
  function versionFromString(versionStr) {
    const result = SIMPLE_VERSION_REGEX.exec(versionStr);
    if (result === null) return void 0;
    const major = parseInt(result[1]);
    const minor = parseInt(result[2]);
    const patch = parseInt(result[3]);
    return { arr: [major, minor, patch], str: versionStr };
  }
  function isVersionString(versionStr) {
    return SIMPLE_VERSION_REGEX.test(versionStr);
  }
  var VERSION_SEARCH_REGEX = /this\.version\s*=\s*["'`]([\d.]+)["'`]/;
  function extractGameVersion() {
    const gameStr = Game.toString();
    const result = VERSION_SEARCH_REGEX.exec(gameStr);
    if (result === null) return void 0;
    return versionFromString(result[1]);
  }
  function isCompatibleVersion(version, compareTo, exact) {
    if (exact)
      return version.arr[0] === compareTo.arr[0] && version.arr[1] === compareTo.arr[1] && version.arr[2] === compareTo.arr[2];
    if (version.arr[0] !== compareTo.arr[0]) return false;
    if (version.arr[1] > compareTo.arr[1]) return false;
    if (version.arr[1] === compareTo.arr[1] && version.arr[2] > compareTo.arr[2])
      return false;
    return true;
  }

  // src/modloader/ui/loader.ts
  var LOADER_UI = {
    root: createElement("div", "ml-loader", ["ml-overlay"]),
    header: createElement("div", "ml-loader-header"),
    title: createElement(
      "h1",
      "ml-loader-title",
      ["ml-heading"],
      "Sixty Four Mod Loader"
    ),
    version: createElement(
      "div",
      "ml-loader-version",
      void 0,
      `v${VERSIONS.loader.str}`
    ),
    status: createElement("p", "ml-loader-status"),
    errors: createElement("div", "ml-loader-errors", [
      "ml-column",
      "ml-container",
      "ml-scroll"
    ]),
    actions: createElement("div", "ml-loader-actions"),
    ignore: createElement("button", "ml-loader-ignore", ["ml-button"], "Ignore"),
    reload: createElement("button", "ml-loader-reload", ["ml-button"], "Reload")
  };
  function initializeLoader() {
    MODLOADER_UI_ROOT.appendChild(LOADER_UI.root);
    LOADER_UI.root.append(LOADER_UI.header, LOADER_UI.status);
    LOADER_UI.header.append(LOADER_UI.title, LOADER_UI.version);
    setLoaderFadeOutDuration(loaderFadeOutDuration);
  }
  function setLoaderStatus(status) {
    LOADER_UI.status.innerText = status;
  }
  var loaderFadeOutDuration = 1e3;
  function setLoaderFadeOutDuration(duration) {
    loaderFadeOutDuration = duration;
    LOADER_UI.root.style.setProperty(
      STYLE_VARS.duration.loaderFadeOut,
      `${loaderFadeOutDuration}ms`
    );
  }
  var loaderErrors = {
    internal: {
      title: "Loader errors",
      entries: []
    },
    external: {
      title: "Mod errors",
      entries: []
    }
  };
  function addLoaderError(error) {
    loaderErrors[error.source].entries.push(error);
  }
  async function finishLoader() {
    if (loaderErrors.internal.entries.length > 0 || loaderErrors.external.entries.length > 0)
      await showErrorScreen();
    closeLoader();
  }
  async function showErrorScreen() {
    for (const groupType in loaderErrors) {
      const errorGroup = loaderErrors[groupType];
      if (errorGroup.entries.length === 0) continue;
      const group = createElement("div", void 0, ["ml-column"]);
      group.appendChild(
        createElement(
          "h2",
          void 0,
          ["ml-loader-error-group-title", "ml-heading"],
          errorGroup.title
        )
      );
      LOADER_UI.errors.appendChild(group);
      for (const error of errorGroup.entries)
        group.appendChild(buildErrorElement(error));
    }
    LOADER_UI.actions.append(LOADER_UI.ignore, LOADER_UI.reload);
    LOADER_UI.reload.addEventListener("click", () => document.location.reload());
    LOADER_UI.status.replaceWith(LOADER_UI.errors, LOADER_UI.actions);
    await new Promise((resolve) => {
      LOADER_UI.ignore.addEventListener("click", resolve);
    });
    LOADER_UI.errors.remove();
    LOADER_UI.actions.remove();
    LOADER_UI.root.append(LOADER_UI.status);
  }
  function buildErrorElement(error) {
    const root = createElement("div", void 0, [
      "ml-loader-error",
      "ml-container",
      "ml-column",
      `ml-${error.severity === "error" ? "red" : "yellow"}`
    ]);
    root.appendChild(
      createElement("p", void 0, ["ml-loader-error-message"], error.summary)
    );
    if (error.details?.length) {
      const details = createElement("details", void 0, [
        "ml-loader-details",
        "ml-column"
      ]);
      root.appendChild(details);
      details.appendChild(
        createElement(
          "summary",
          void 0,
          ["ml-loader-details-summary"],
          "See details"
        )
      );
      const content = createElement("div", void 0, [
        "ml-loader-details-content",
        "ml-column"
      ]);
      details.append(content);
      for (const detail of error.details)
        content.appendChild(
          createElement("p", void 0, ["ml-loader-details-line"], detail)
        );
    }
    return root;
  }
  function closeLoader() {
    LOADER_UI.status.innerText = "Loaded Successfully";
    LOADER_UI.root.classList.add("finished");
    setTimeout(() => LOADER_UI.root.remove(), loaderFadeOutDuration);
  }
  registerStyle(`
#ml-loader {
	transition: opacity var(${STYLE_VARS.duration.loaderFadeOut}, 1000ms) ease-out;
	z-index: ${Z_INDEX.loader};
}

#ml-loader.finished {
	pointer-events: none;
	opacity: 0;
}

#ml-loader-title {
	font-size: 3rem;
}

#ml-loader-version {
	color: var(${STYLE_VARS.color.fadedText});
	font-size: 0.9rem;
}

#ml-loader-header,
#ml-loader-status {
	text-align: center;
}

#ml-loader-errors {
	gap: 2rem;
	width: 60ch;
	max-width: 100%;
	height: 40vh;
}

.ml-loader-error-group-title {
	font-size: 2rem;
}

.ml-loader-error {
	gap: 0.5rem;
	padding: 0.5rem;
	border: 1px solid;
}

.ml-loader-error.ml-yellow {
	--ml-error-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23987038" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>');
}

.ml-loader-error.ml-red {
    --ml-error-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23803038" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16h.01"/><path d="M12 8v4"/><path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"/></svg>');
}

.ml-loader-error-message {
	position: relative;
	padding-left: 1.5rem;
}

.ml-loader-error-message::before {
	content: '';
	position: absolute;
	width: 1rem;
	aspect-ratio: 1;
	left: 0;
	background-image: var(--ml-error-icon);
	background-size: cover;
}

.ml-loader-details {
	gap: 0.5rem;
}

.ml-loader-details-summary {
	color: var(${STYLE_VARS.color.fadedText});
	cursor: pointer;
}

.ml-loader-details-summary:hover {
	color: var(${STYLE_VARS.color.text});
}

.ml-loader-details-content {
	gap: 0.5rem;
	padding: 0.5rem 1rem;
}

#ml-loader-actions {
	display: flex;
	justify-content: center;
	gap: 1rem;
}

#ml-loader-actions .ml-button {
	min-width: 35ch;
}

#ml-loader-ignore {
	background-color: var(${STYLE_VARS.color.red});
}`);

  // src/modloader/utils/tools.ts
  var import_path = __toESM(__require("path"));
  var import_electron = __require("electron");
  function deepFreeze(target) {
    if (typeof target === "object" && target !== null) {
      for (const propName of Reflect.ownKeys(target)) deepFreeze(target[propName]);
      return Object.freeze(target);
    }
    if (typeof target === "function") return Object.freeze(target);
    return target;
  }
  function deepCopy(target) {
    if (typeof target !== "object" || target === null) return target;
    if (Array.isArray(target)) return target.map((val) => deepCopy(val));
    const copy = {};
    for (const propName of Reflect.ownKeys(target)) {
      copy[propName] = deepCopy(target[propName]);
    }
    return copy;
  }
  var LOG_PREFIX = "[MODLOADER]";
  function log(...args) {
    console.log(LOG_PREFIX, ...args);
  }
  var MODS_DIR_PATH = import_path.default.join(__dirname, "../../../../mods");
  var HEX_COLOR_REGEX = /^#([\da-f]{3,4}){1,2}$/;
  function validateHexColor(val, def, alpha) {
    if (val.length < 3 || val.length > 9) return def;
    const normalized = (val.startsWith("#") ? val : "#" + val).toLowerCase();
    if (!HEX_COLOR_REGEX.test(normalized)) return def;
    switch (normalized.length) {
      case 4:
      case 5:
        const r = normalized[1];
        const g = normalized[2];
        const b = normalized[3];
        const a = alpha ? normalized[4] ?? "f" : "";
        return `#${r}${r}${g}${g}${b}${b}${a}${a}`;
      case 7:
        return alpha ? normalized + "ff" : normalized;
      case 9:
        return alpha ? normalized : normalized.substring(0, 7);
      default:
        return def;
    }
  }
  var MOD_TOOLBOX = {
    inModsDir(target) {
      return import_path.default.join(MODS_DIR_PATH, target);
    },
    newModLogger(namespace) {
      const prefix = `[MOD: ${namespace}]`;
      const logger = {
        log: (...args) => console.log(prefix, ...args)
      };
      return Object.freeze(logger);
    },
    focusesTextEditableElement() {
      const element = document.activeElement;
      if (!element) return false;
      const tagName = element.tagName;
      return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT" || element.isContentEditable;
    },
    sanitizers: {
      nonNegative(val, _def) {
        return val < 0 ? 0 : val;
      },
      colorHexRGB(val, def) {
        return validateHexColor(val, def, false);
      },
      colorHexRGBA(val, def) {
        return validateHexColor(val, def, true);
      }
    }
  };
  function bindToolbox() {
    setLoaderStatus("Binding mod toolbox");
    Object.defineProperty(globalThis, "MOD_TOOLBOX", {
      value: deepFreeze(MOD_TOOLBOX),
      writable: false,
      configurable: false,
      enumerable: false
    });
  }
  function bindDevToolsHook() {
    setLoaderStatus("Binding dev tools hook");
    window.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === "I") {
        import_electron.ipcRenderer.send("ml-dt");
        log("Opening dev tools");
      }
    });
  }

  // src/modloader/core/codex.ts
  function updateCodex(mods) {
    setLoaderStatus("Applying codex updates");
    let codex = abstract_getCodex();
    for (const mod of mods) {
      try {
        const next = deepCopy(codex);
        mod.definition.updateCodex?.(mod.mctx, next);
        codex = next;
      } catch (e) {
        addLoaderError({
          source: "external",
          severity: "error",
          summary: `An error occured while updating codex for mod "${mod.definition.name}".`,
          details: [e instanceof Error ? e.message : String(e)]
        });
      }
    }
    globalThis.abstract_getCodex = () => codex;
  }

  // src/modloader/core/mod.ts
  var import_fs = __toESM(__require("fs"));
  var import_path2 = __toESM(__require("path"));

  // src/modloader/utils/validate.ts
  var DIRECT = ["string", "number", "boolean", "function"];
  function validate(schema, value, path3 = "<root>") {
    if (DIRECT.includes(schema.type))
      return typeof value !== schema.type ? [`${path3}: Expected ${schema.type}`] : [];
    const errors = [];
    switch (schema.type) {
      case "exact":
        if (!schema.matches.includes(value))
          errors.push(
            `${path3}: Expected exact value${schema.matchesInError ? ` (${schema.matches.join(" | ")})` : ""}`
          );
        break;
      case "array":
        if (!Array.isArray(value)) {
          errors.push(`${path3}: Expected array`);
          break;
        }
        if (schema.items) {
          for (let i = 0; i < value.length; i++) {
            errors.push(...validate(schema.items, value[i], `${path3}[${i}]`));
          }
        }
        break;
      case "object":
        if (typeof value !== "object" || value === null || Array.isArray(value)) {
          errors.push(`${path3}: Expected object`);
          break;
        }
        for (const key of schema.required || []) {
          if (!(key in value)) {
            errors.push(`${path3}.${key}: Required property missing`);
          }
        }
        for (const [key, propSchema] of Object.entries(schema.properties ?? {})) {
          if (key in value) {
            errors.push(
              ...validate(
                propSchema,
                value[key],
                `${path3}.${key}`
              )
            );
          }
        }
        if (schema.extra?.self)
          errors.push(
            ...schema.extra.self(value, path3)
          );
        if (schema.extra?.all) {
          for (const key in value) {
            errors.push(
              ...validate(
                schema.extra.all,
                value[key],
                `${path3}.${key}`
              )
            );
          }
        }
        break;
      case "any":
        break;
    }
    return errors;
  }

  // src/modloader/core/mod.ts
  async function loadMods(modsDir, settings, gameVersion) {
    setLoaderStatus("Loading mods");
    const rawMods = await loadRawMods(modsDir);
    setLoaderStatus("Initializing mods");
    const mods = [];
    for (const rawMod of rawMods) {
      const modConfig = settings.mods[rawMod.id] ??= {
        enabled: true,
        settings: {}
      };
      const mod = {
        definition: deepFreeze(rawMod),
        enabled: modConfig.enabled,
        mctx: deepFreeze({ settings: {} })
      };
      verifyModVersions(rawMod, gameVersion);
      if (rawMod.settings) {
        const settings2 = loadModSettings(rawMod, modConfig.settings);
        mod.settings = deepFreeze(settings2);
        mod.mctx = Object.freeze({ settings: settings2 });
      }
      mods.push(mod);
    }
    return mods;
  }
  async function loadRawMods(modsDir) {
    setLoaderStatus("Loading mod files");
    if (!import_fs.default.existsSync(modsDir)) {
      import_fs.default.mkdirSync(modsDir);
      return [];
    }
    const modFiles = import_fs.default.readdirSync(modsDir).sort().filter((name) => name.endsWith(".js")).map((name) => ({
      name,
      path: import_path2.default.join(modsDir, name)
    })).filter((file) => import_fs.default.statSync(file.path).isFile());
    const rawMods = [];
    for (const modFile of modFiles) {
      setLoaderStatus(`Loading mod file "${modFile.name}"`);
      let mod;
      try {
        const rawMod = await Promise.resolve().then(() => __toESM(__require(modFile.path)));
        mod = rawMod.default;
      } catch (e) {
        addLoaderError({
          source: "external",
          severity: "error",
          summary: `Could not load file "${modFile.name}"`,
          details: [e instanceof Error ? e.message : String(e)]
        });
        continue;
      }
      setLoaderStatus(`Validating mod file "${modFile.name}"`);
      const errors = validate(MOD_SCHEMA, mod);
      if (errors.length !== 0) {
        addLoaderError({
          source: "external",
          severity: "error",
          summary: `Invalid mod definition in file "${modFile.name}"`,
          details: errors
        });
        continue;
      }
      rawMods.push({ mod, file: modFile.name });
    }
    return filterUniqueIds(rawMods);
  }
  var MOD_VERSION_FIELDS = ["version", "gameVersion", "loaderVersion"];
  var MOD_SCHEMA = {
    type: "object",
    required: ["id", "name", "description", ...MOD_VERSION_FIELDS],
    extra: {
      self(value, path3) {
        return MOD_VERSION_FIELDS.filter(
          (key) => typeof value[key] !== "string" || !isVersionString(value[key])
        ).map((key) => `${path3}.${key}: Expected a version string`);
      }
    },
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      description: { type: "string" },
      ...Object.fromEntries(
        MOD_VERSION_FIELDS.map((key) => [key, { type: "string" }])
      ),
      getPatches: { type: "function" },
      updateCodex: { type: "function" },
      getStyles: { type: "function" },
      onLoad: { type: "function" },
      settings: {
        type: "object",
        extra: {
          all: {
            type: "object",
            required: ["type", "name", "default", "sanitize"],
            properties: {
              type: {
                type: "exact",
                matches: ["string", "number", "boolean"],
                matchesInError: true
              },
              name: { type: "string" },
              description: { type: "string" },
              sanitize: { type: "function" }
            },
            extra: {
              self: (value, path3) => typeof value.default !== value.type ? [`${path3}.default: Expected ${value.type}`] : []
            }
          }
        }
      }
    }
  };
  function filterUniqueIds(mods) {
    setLoaderStatus("Checking mod id uniqueness");
    const seenIds = {};
    const issues = {};
    for (const mod of mods) {
      const id = mod.mod.id;
      if (!(id in seenIds)) {
        seenIds[id] = mod.file;
        continue;
      }
      ;
      (issues[id] ??= [seenIds[id]]).push(mod.file);
    }
    for (const [id, files] of Object.entries(issues)) {
      addLoaderError({
        source: "external",
        severity: "error",
        summary: `Multiple mod files specify the same unique id "${id}"`,
        details: ["These files will not be loaded:", ...files]
      });
    }
    return mods.filter((mod) => !(mod.mod.id in issues)).map((mod) => mod.mod);
  }
  function verifyModVersions(rawMod, gameVersion) {
    const modLoaderVersion = versionFromString(rawMod.loaderVersion);
    if (modLoaderVersion === void 0 || !isCompatibleVersion(modLoaderVersion, VERSIONS.loader)) {
      addLoaderError({
        source: "external",
        severity: "warning",
        summary: `Mod "${rawMod.name}" requires a newer version of the mod loader and might not work properly.`,
        details: [
          `Required loader version: ${rawMod.loaderVersion}`,
          `Current loader version: ${VERSIONS.loader.str}`
        ]
      });
    }
    if (gameVersion === void 0) return;
    const modGameVersion = versionFromString(rawMod.gameVersion);
    if (modGameVersion === void 0 || !isCompatibleVersion(modGameVersion, gameVersion, true)) {
      addLoaderError({
        source: "external",
        severity: "warning",
        summary: `Mod "${rawMod.name}" requires a different game version and might not work properly.`,
        details: [
          `Target game version: ${rawMod.gameVersion}`,
          `Current game version: ${gameVersion.str}`
        ]
      });
    }
  }
  function loadModSettings(mod, saved) {
    if (mod.settings === void 0) return {};
    const settings = {};
    const issues = [];
    for (const [id, setting] of Object.entries(mod.settings)) {
      const savedSetting = saved[id];
      const savedValue = savedSetting?.type === setting.type ? savedSetting.value : setting.default;
      let value;
      try {
        value = setting.sanitize(savedValue, setting.default);
      } catch (e) {
        addLoaderError({
          source: "external",
          severity: "error",
          summary: `An error occured while sanitizing setting "${id}" for mod "${mod.name}"`,
          details: [e instanceof Error ? e.message : String(e)]
        });
        value = setting.default;
      }
      if (typeof value !== setting.type) {
        issues.push({ id, expected: setting.type, received: typeof value });
        value = setting.default;
      }
      settings[id] = {
        type: setting.type,
        value
      };
    }
    if (issues.length > 0) {
      addLoaderError({
        source: "external",
        severity: "warning",
        summary: `Some setting sanitizers for mod "${mod.name}" returned mismatched types. These settigns were reset to detaults.`,
        details: issues.map(
          (issue) => `Setting "${issue.id}": expected "${issue.expected}", received: "${issue.received}"`
        )
      });
    }
    return settings;
  }
  function onLoadMods(mods) {
    for (const mod of mods) {
      try {
        mod.definition.onLoad?.(mod.mctx);
      } catch (e) {
        addLoaderError({
          source: "external",
          severity: "error",
          summary: `An error occured while running the "onLoad" hook for mod "${mod.definition.name}"`,
          details: [e instanceof Error ? e.message : String(e)]
        });
      }
    }
  }

  // src/modloader/core/patch.ts
  var _METHOD_PATCH_SCHEMA = {
    type: "object",
    extra: {
      all: { type: "function" }
    }
  };
  var PATCH_SPEC_SCHEMA = {
    type: "object",
    extra: {
      all: {
        type: "object",
        properties: {
          new: { type: "function" },
          replace: _METHOD_PATCH_SCHEMA,
          wrap: _METHOD_PATCH_SCHEMA,
          observe: _METHOD_PATCH_SCHEMA
        }
      }
    }
  };
  var METHOD_PATCH_GROUPS = ["replace", "wrap", "observe"];
  function collectPatches(mods) {
    setLoaderStatus("Collecting mod patches");
    const collection = {};
    for (const mod of mods) {
      if (!mod.definition.getPatches) continue;
      try {
        mod.patches = mod.definition.getPatches(mod.mctx);
      } catch (e) {
        addLoaderError({
          source: "external",
          severity: "error",
          summary: `An error occured while processing patches for mod "${mod.definition.name}"`,
          details: [e instanceof Error ? e.message : String(e)]
        });
        continue;
      }
      const errors = validate(PATCH_SPEC_SCHEMA, mod.patches);
      if (errors.length > 0) {
        log(errors);
        continue;
      }
      addModPatches(collection, mod.definition.name, mod.patches);
    }
    detectConflicts(collection);
    return collection;
  }
  function addModPatches(collection, modName, patches) {
    for (const className of Object.keys(patches)) {
      const classPatch = patches[className];
      if (classPatch === void 0) continue;
      const classPatchCollection = collection[className] ??= { methods: {} };
      for (const groupName of METHOD_PATCH_GROUPS) {
        const patchGroup = classPatch[groupName];
        if (patchGroup === void 0) continue;
        for (const methodName of Object.keys(patchGroup)) {
          const methodPatchCollection = classPatchCollection.methods[methodName] ??= {
            replace: [],
            wrap: [],
            observe: []
          };
          methodPatchCollection[groupName].push({
            mod: modName,
            patch: patchGroup[methodName]
          });
        }
      }
    }
  }
  function detectConflicts(collection) {
    for (const className in collection) {
      const classMethodsCollection = collection[className]?.methods ?? {};
      for (const methodName in classMethodsCollection) {
        const methodPatchCollection = classMethodsCollection[methodName];
        if (methodPatchCollection === void 0 || methodPatchCollection.replace.length <= 1) {
          continue;
        }
        addLoaderError({
          source: "external",
          severity: "warning",
          summary: `Multiple mods are in conflict patching "${className}.${methodName}", and only the first one will work properly.`,
          details: methodPatchCollection.replace.map((entry) => entry.mod)
        });
      }
    }
  }
  function applyPatches(patches, patchableClassMap) {
    setLoaderStatus("Applying mod patches");
    for (const className in patches) {
      const classPatch = patches[className];
      if (classPatch === void 0) continue;
      const patchableClass = patchableClassMap[className];
      const shouldBePresent = className in patchableClassMap;
      const isPresent = patchableClass !== void 0;
      if (!shouldBePresent || !isPresent) {
        const modNamesSet = /* @__PURE__ */ new Set();
        Object.values(classPatch.methods).forEach((method) => {
          if (method !== void 0) {
            Object.values(method).forEach(
              (group) => group.forEach((entry) => modNamesSet.add(entry.mod))
            );
          }
        });
        const modNames = Array.from(modNamesSet);
        const summary = shouldBePresent ? `An expected class "${className}" patched by mods is missing at runtime.` : `Mods tried to patch an invalid class "${className}".`;
        addLoaderError({
          source: "external",
          severity: "error",
          summary,
          details: modNames
        });
        continue;
      }
      for (const methodName in classPatch.methods) {
        const methodPatch = classPatch.methods[methodName];
        if (methodPatch === void 0) continue;
        const handler = composeMethodPatches(
          methodPatch,
          `${className}.${methodName}`
        );
        patchableClass.prototype[methodName] = new Proxy(
          patchableClass.prototype[methodName],
          handler
        );
      }
    }
  }
  function composeMethodPatches(methodPatchCollection, targetId) {
    const wraps = methodPatchCollection.wrap;
    const observers = methodPatchCollection.observe;
    const replace = methodPatchCollection.replace?.length > 0 ? methodPatchCollection.replace[0] : void 0;
    const expectedCounter = wraps.length;
    const sourceStack = [...wraps.map((w) => w.mod), replace ? replace.mod : "game"];
    const final = replace ? (ctx, ...args) => replace.patch({ self: ctx.self }, ...args) : (ctx, ...args) => ctx.original.apply(ctx.self, args);
    const composite = wraps.length === 0 ? final : wraps.map((w) => w.patch).reduceRight(
      (next, wrap) => (ctx, ...args) => wrap(
        {
          self: ctx.self,
          original: (...args2) => {
            ctx.pointer++;
            ctx.counter++;
            const res = next(ctx, ...args2);
            ctx.pointer--;
            return res;
          }
        },
        ...args
      ),
      final
    );
    const runComposite = wraps.length > 0 || replace;
    const runObservers = observers.length > 0;
    return {
      apply(target, thisArg, argArray) {
        let res;
        if (runComposite) {
          const ctx = {
            self: thisArg,
            original: target,
            pointer: 0,
            counter: 0
          };
          try {
            res = composite(ctx, ...argArray);
            if (ctx.counter !== expectedCounter) {
              contractViolation(sourceStack[ctx.counter], targetId);
            }
          } catch (e) {
            patchError(sourceStack[ctx.pointer], targetId, e);
          }
        } else {
          res = target.apply(thisArg, argArray);
        }
        if (runObservers) {
          let i = 0;
          try {
            for (; i < observers.length; i++) {
              observers[i].patch({ self: thisArg }, res, ...argArray);
            }
          } catch (e) {
            patchError(observers[i].mod, targetId, e);
          }
        }
        return res;
      }
    };
  }
  function patchError(who, where, what) {
    console.log(`[CONTRACT VIOLATION] ${who} (at ${where}):`, what);
  }
  function contractViolation(who, where) {
    console.log(`[CONTRACT VIOLATION] ${who} (at ${where})`);
  }
  function getPatchableClasses() {
    return {
      Bezier,
      VFX,
      Exhaust,
      ResourceExplosion,
      ResourceSpark,
      ScannerMap,
      Impact,
      ResourceTransfer,
      ChasmTransfer,
      Lightning,
      DarkWave,
      Game,
      Sprite,
      Entity,
      Strange,
      Strange1,
      Strange2,
      Strange3,
      Vault,
      Doublechannel,
      Consumer,
      Preheater,
      Doublechannel2,
      Auxpump,
      Auxpump2,
      Valve,
      Injector,
      Entropic,
      Entropic2,
      Entropic2a,
      Entropic3,
      Destabilizer,
      Destabilizer2,
      Destabilizer2a,
      Converter32,
      Converter13,
      Converter41,
      Converter76,
      Converter64,
      Reflector,
      Generaldecay,
      Cube,
      Pump,
      Pump2,
      Mega1,
      Mega1a,
      Mega1b,
      Mega2,
      Mega3,
      Eye,
      Clicker1,
      Clicker2,
      Clicker3,
      Cookie,
      Pinhole,
      Gradient,
      Chasm,
      Conductor,
      Voidsculpture,
      Hollow,
      Flower,
      Fruit,
      Vessel,
      Vessel2,
      Silo,
      Silo2,
      Waypoint,
      Waypoint2,
      Annihilator,
      Surge,
      Stabilizer,
      Stabilizer2,
      Stabilizer3,
      Scan,
      Puncture,
      Achiever,
      Messenger,
      Splash,
      Cloud,
      Shop,
      Explainer
    };
  }

  // src/modloader/core/preload.ts
  var GAME_SCRIPT_PRELOAD_URLS = [
    `scripts/bezier.js`,
    `scripts/ui.js`,
    `scripts/sprites.js`,
    `scripts/stuff.js`,
    `scripts/words.js`,
    `scripts/codex.js`,
    `scripts/osimp.js`,
    `scripts/mobile.js`
  ];
  async function preloadScript(url) {
    return new Promise((resolve, reject) => {
      const element = document.createElement("script");
      element.type = "text/javascript";
      element.src = url;
      element.onload = () => {
        log(`Preloaded script: ${url}`);
        resolve();
      };
      element.onerror = () => {
        log(`Script preload failed: ${url}`);
        reject(url);
      };
      document.head.appendChild(element);
    });
  }
  async function preloadGameScripts() {
    setLoaderStatus("Preloading game scripts for patching");
    Game.prototype.loadScript = new Proxy(
      Game.prototype.loadScript,
      {
        apply(target, thisArg, argArray) {
          if (GAME_SCRIPT_PRELOAD_URLS.includes(argArray[0]))
            return Promise.resolve();
          return Reflect.apply(target, thisArg, argArray);
        }
      }
    );
    const results = await Promise.allSettled(
      GAME_SCRIPT_PRELOAD_URLS.map(preloadScript)
    );
    const fails = results.filter((result) => result.status === "rejected");
    if (fails.length === 0) return;
    addLoaderError({
      source: "internal",
      severity: "warning",
      summary: `${fails.length} game script${fails.length > 1 ? "s" : ""} failed to preload`,
      details: [
        "Mods depending on these scripts may fail:",
        ...fails.map((fail) => `"${fail}"`)
      ]
    });
  }

  // src/modloader/core/settings.ts
  var import_fs2 = __toESM(__require("fs"));
  var DEFAULT_SETTINGS = {
    format: 1,
    modloader: {
      unsafe: false,
      loaderFadeOutDuration: 1e3
    },
    mods: {}
  };
  var SETTINGS_SCHEMA = {
    type: "object",
    required: ["format", "modloader", "mods"],
    properties: {
      format: { type: "exact", matches: [1], matchesInError: true },
      modloader: {
        type: "object",
        required: ["unsafe", "loaderFadeOutDuration"],
        properties: {
          unsafe: { type: "boolean" },
          loaderFadeOutDuration: { type: "number" }
        }
      },
      mods: {
        type: "object",
        extra: {
          all: {
            type: "object",
            required: ["enabled", "settings"],
            properties: {
              enabled: { type: "boolean" },
              settings: {
                type: "object",
                extra: {
                  all: {
                    type: "object",
                    required: ["type", "value"],
                    properties: {
                      type: { type: "string" }
                    },
                    extra: {
                      self: (value, path3) => typeof value.value !== value.type ? [`${path3}.value: Expected ${value.type}`] : []
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  function loadSettings(path3) {
    setLoaderStatus("Loading settings");
    let settings = DEFAULT_SETTINGS;
    try {
      if (!import_fs2.default.existsSync(path3)) return { settings, errors: [] };
      if (!import_fs2.default.statSync(path3).isFile()) return { settings, errors: ["Not a file"] };
      const file = import_fs2.default.readFileSync(path3, {
        encoding: "utf-8"
      });
      settings = JSON.parse(file);
    } catch (e) {
      return {
        settings,
        errors: [e instanceof Error ? e.message : String(e)]
      };
    }
    const errors = validate(SETTINGS_SCHEMA, settings);
    if (errors.length !== 0) {
      return {
        settings: DEFAULT_SETTINGS,
        errors: ["Invalid settings configuration file structure:", ...errors]
      };
    }
    return { settings, errors: [] };
  }
  function synchronizeSettingsWithMods(settings, mods) {
    const updated = {
      format: settings.format,
      modloader: settings.modloader,
      mods: {}
    };
    for (const mod of mods) {
      updated.mods[mod.definition.id] = {
        enabled: mod.enabled,
        settings: mod.settings ?? {}
      };
    }
    return updated;
  }
  function saveSettings(path3, settings) {
    log("Saving settings");
    try {
      const data = JSON.stringify(settings, void 0, "	");
      import_fs2.default.writeFileSync(path3, data, {
        encoding: "utf-8"
      });
      return null;
    } catch (e) {
      log("Settings configuration file could not be saved:", e);
      return e instanceof Error ? e.message : String(e);
    }
  }

  // src/modloader/ui/settings.ts
  var SETTINGS_UI = {
    root: createElement("div", "ml-settings", ["ml-overlay"]),
    header: createElement(
      "h2",
      "ml-settings-header",
      ["ml-heading"],
      "Mod Settings"
    ),
    content: createElement("div", "ml-settings-content", [
      "ml-column",
      "ml-scroll"
    ]),
    footer: createElement("div", "ml-settings-footer", ["ml-column"]),
    actions: createElement("div", "ml-settings-actions"),
    changeCounter: createElement(
      "div",
      "ml-settings-change-counter",
      ["ml-heading"],
      "0 changes"
    ),
    cancel: createElement(
      "button",
      "ml-settings-cancel",
      ["ml-button"],
      "Cancel"
    ),
    save: createElement(
      "button",
      "ml-settings-save",
      ["ml-button"],
      "Save and Reload"
    )
  };
  var settingChanges = {};
  var enableChanges = {};
  var changeCounter = 0;
  function changeEnabled(mod, enabled, label, reset) {
    updateEnabledLabel(enabled, label);
    const modId = mod.definition.id;
    const isChanged = modId in enableChanges;
    if (mod.enabled === enabled) {
      if (isChanged) {
        delete enableChanges[mod.definition.id];
        updateCounter(-1);
      }
      return;
    }
    if (isChanged) {
      enableChanges[modId].new = enabled;
      return;
    }
    updateCounter(1);
    enableChanges[modId] = {
      type: "boolean",
      current: mod.enabled,
      new: enabled,
      reset
    };
  }
  function updateEnabledLabel(enabled, label) {
    label.classList.toggle("ml-green", enabled);
    label.classList.toggle("ml-red", !enabled);
    label.textContent = enabled ? "Enabled" : "Disabled";
  }
  function changeSetting(mod, settingId, value, reset) {
    if (!mod.settings || !(settingId in mod.settings)) return;
    const modId = mod.definition.id;
    const current = mod.settings[settingId];
    const modSettingChanges = settingChanges[modId] ??= {};
    const isChanged = settingId in modSettingChanges;
    if (current.value === value) {
      if (isChanged) {
        delete modSettingChanges[settingId];
        updateCounter(-1);
        if (Object.keys(modSettingChanges).length === 0) {
          delete settingChanges[modId];
        }
      }
      return;
    }
    if (isChanged) {
      modSettingChanges[settingId].new = value;
      return;
    }
    updateCounter(1);
    modSettingChanges[settingId] = {
      type: current.type,
      current: current.value,
      new: value,
      reset
    };
  }
  function updateCounter(change) {
    if (change !== void 0) changeCounter += change;
    else {
      changeCounter = Object.keys(enableChanges).length + Object.values(settingChanges).reduce(
        (count, group) => count + Object.keys(group).length,
        0
      );
    }
    SETTINGS_UI.changeCounter.innerText = `${changeCounter} change${changeCounter === 1 ? "" : "s"}`;
    SETTINGS_UI.changeCounter.classList.toggle("ml-changed", changeCounter !== 0);
  }
  function applyChanges(settingsPath, settings) {
    for (const mod in enableChanges) {
      const modSettings = settings.mods[mod];
      if (modSettings === void 0) continue;
      modSettings.enabled = enableChanges[mod].new;
    }
    for (const mod in settingChanges) {
      const modSettings = settings.mods[mod]?.settings;
      if (modSettings === void 0) continue;
      const modChanges = settingChanges[mod];
      const newSettings = {};
      for (const setting in modSettings) {
        const modSetting = modSettings[setting];
        const modChange = modChanges[setting];
        if (modChange === void 0) {
          newSettings[setting] = modSetting;
          continue;
        }
        newSettings[setting] = {
          type: modSetting.type,
          value: modChange.new
        };
      }
      settings.mods[mod].settings = newSettings;
    }
    saveSettings(settingsPath, settings);
  }
  function discardChanges() {
    for (const change of Object.values(enableChanges)) {
      change.reset();
    }
    enableChanges = {};
    for (const changeGroup of Object.values(settingChanges)) {
      for (const change of Object.values(changeGroup)) {
        change.reset();
      }
    }
    settingChanges = {};
    updateCounter(-changeCounter);
  }
  function initializeSettings(mods, settingsPath, settings) {
    setLoaderStatus("Initializing settings menu");
    SETTINGS_UI.root.append(
      SETTINGS_UI.header,
      SETTINGS_UI.content,
      SETTINGS_UI.footer
    );
    for (const mod of mods) SETTINGS_UI.content.appendChild(createSection(mod));
    SETTINGS_UI.footer.append(SETTINGS_UI.changeCounter, SETTINGS_UI.actions);
    SETTINGS_UI.actions.append(SETTINGS_UI.cancel, SETTINGS_UI.save);
    SETTINGS_UI.cancel.addEventListener("click", () => {
      discardChanges();
      closeSettings();
    });
    SETTINGS_UI.save.addEventListener("click", () => {
      applyChanges(settingsPath, settings);
      if (game) game.saveGame();
      document.location.reload();
    });
    MODLOADER_UI_ROOT.appendChild(SETTINGS_UI.root);
  }
  function createSection(mod) {
    const section = createElement("div", void 0, [
      "ml-settings-mod",
      "ml-column",
      "ml-container"
    ]);
    section.appendChild(
      createElement(
        "h3",
        void 0,
        ["ml-settings-mod-name", "ml-heading"],
        mod.definition.name
      )
    );
    const enabledId = `ml-settings-mod-enabled-${mod.definition.id}`;
    const enabled = createElement("input", enabledId, ["ml-settings-mod-enabled"]);
    enabled.type = "checkbox";
    enabled.checked = mod.enabled;
    enabled.addEventListener(
      "change",
      () => changeEnabled(mod, enabled.checked, label, () => {
        enabled.checked = mod.enabled;
        updateEnabledLabel(mod.enabled, label);
      })
    );
    const label = createElement("label", void 0, [
      "ml-settings-mod-enabled-label",
      "ml-container"
    ]);
    label.htmlFor = enabledId;
    updateEnabledLabel(mod.enabled, label);
    section.append(
      enabled,
      label,
      createElement(
        "p",
        void 0,
        ["ml-settings-mod-description"],
        mod.definition.description
      )
    );
    for (const setting in mod.definition.settings) {
      section.appendChild(
        createSetting(
          mod,
          setting,
          mod.definition.settings[setting],
          mod.settings[setting].value
        )
      );
    }
    return section;
  }
  function createSetting(mod, settingId, definition, value) {
    const root = createElement("div", void 0, [
      "ml-settings-mod-setting",
      `ml-setting-${definition.type}`,
      "ml-column"
    ]);
    root.appendChild(
      createElement(
        "h4",
        void 0,
        ["ml-settings-mod-setting-name", "ml-heading"],
        definition.name
      )
    );
    if (definition.description)
      root.appendChild(
        createElement(
          "p",
          void 0,
          ["ml-settings-mod-setting-description"],
          definition.description
        )
      );
    const input = createElement("input", void 0, [
      "ml-settings-mod-setting-input",
      "ml-input"
    ]);
    let valueGetter;
    let valueReset;
    switch (definition.type) {
      case "boolean":
        input.type = "checkbox";
        input.checked = value;
        valueGetter = () => input.checked;
        valueReset = () => {
          input.checked = value;
        };
        break;
      case "number":
        input.type = "number";
        input.value = String(value);
        valueGetter = () => input.valueAsNumber;
        valueReset = () => {
          input.value = String(value);
        };
        break;
      case "string":
        input.type = "text";
        input.value = value;
        valueGetter = () => input.value;
        valueReset = () => {
          input.value = value;
        };
        break;
    }
    input.addEventListener(
      "change",
      () => changeSetting(mod, settingId, valueGetter(), valueReset)
    );
    root.appendChild(input);
    return root;
  }
  function openSettings() {
    SETTINGS_UI.root.classList.add("ml-open");
  }
  function closeSettings() {
    SETTINGS_UI.root.classList.remove("ml-open");
  }
  registerStyle(`
#ml-settings {
	padding: 3rem 0;
	text-align: center;
	z-index: ${Z_INDEX.settings};
}

#ml-settings:not(.ml-open) {
	display: none;
}

#ml-settings-header {
	font-size: 3rem;
}

#ml-settings-content {
	padding: 1rem;
	width: inherit;
	max-width: 60ch;
}

.ml-settings-mod {
	align-items: center
}

.ml-settings-mod-name {
	font-size: 2rem;
}

.ml-settings-mod-setting {
	gap: 0.5rem;
	align-items: center;
}

.ml-settings-mod-enabled {
	display: none;
}

.ml-settings-mod-enabled-label {
	width: 12ch;
	font-weight: bold;
	letter-spacing: 1px;
	color: var(${STYLE_VARS.color.red});
	cursor: pointer;
}

.ml-settings-mod-enabled-label.ml-green {
	color: var(${STYLE_VARS.color.green});
}

.ml-settings-mod-setting-name {
	font-size: 1.2rem;
	font-weight: bold;
}

.ml-settings-mod-setting-input {
	max-width: 40ch;
}

#ml-settings-change-counter {
	font-size: 1.2rem;
	text-transform: uppercase;
}

#ml-settings-actions {
	display: flex;
	justify-content: center;
	gap: 0.5rem;
}

#ml-settings-actions > .ml-button {
	min-width: 35ch;
}`);

  // src/modloader/ui/splash.ts
  var SPLASH_UI = {
    root: createElement("div", "ml-splash-menu", ["ml-column", "ml-container"]),
    header: createElement(
      "h2",
      "ml-splash-menu-header",
      ["ml-heading"],
      "Mod Loader"
    ),
    settings: createElement(
      "button",
      "ml-splash-menu-settings",
      ["ml-button"],
      "Settings"
    ),
    reload: createElement(
      "button",
      "ml-splash-menu-reload",
      ["ml-button"],
      "Reload"
    )
  };
  var splashPatchSpec = {
    Splash: {
      observe: {
        show: openSplashMenu,
        close: closeSplashMenu
      }
    }
  };
  function openSplashMenu() {
    SPLASH_UI.root.classList.add("ml-open");
  }
  function closeSplashMenu() {
    SPLASH_UI.root.classList.remove("ml-open");
  }
  var BUILTIN_MOD_NAME = "[modloader-builtin]";
  function initSplashMenu(collection) {
    addModPatches(collection, BUILTIN_MOD_NAME, splashPatchSpec);
    SPLASH_UI.settings.addEventListener("click", openSettings);
    SPLASH_UI.reload.addEventListener("click", () => {
      if (game) game.saveGame();
      document.location.reload();
    });
    SPLASH_UI.root.append(SPLASH_UI.header, SPLASH_UI.settings, SPLASH_UI.reload);
    MODLOADER_UI_ROOT.appendChild(SPLASH_UI.root);
  }
  registerStyle(`
#ml-splash-menu {
	left: 3rem;
	bottom: 4rem;
	z-index: ${Z_INDEX.splash};
}

#ml-splash-menu:not(.ml-open) {
	display: none;
}

#ml-splash-menu {
	font-size: 1.2rem;
	width: max-content;
	gap: 1rem;
}

#ml-splash-menu .ml-button {
	width: 100%
}
`);

  // src/modloader/index.ts
  async function main() {
    log("Initializing");
    initializeUI();
    initializeLoader();
    setLoaderStatus("Verifying game and loader versions");
    const gameVersion = extractGameVersion();
    if (gameVersion === void 0) {
      addLoaderError({
        source: "internal",
        severity: "warning",
        summary: "Mod Loader could not determine the curernt game version.Compatibility checks are disabled.",
        details: [
          "Game version detection failed.",
          "Some mods may not be compatible."
        ]
      });
    } else if (!isCompatibleVersion(gameVersion, VERSIONS.gameTarget, true)) {
      addLoaderError({
        source: "internal",
        severity: "warning",
        summary: "Mod Loader targets a different game version than the one currently running.",
        details: [
          `Detected game version: ${gameVersion.str}`,
          `Targeted version: ${VERSIONS.gameTarget.str}`,
          "Compatibility is not guaranteed. You might want to download matching version of the Mod Loader if available."
        ]
      });
    }
    bindToolbox();
    bindDevToolsHook();
    await preloadGameScripts();
    const settingsPath = MOD_TOOLBOX.inModsDir("../modloader/settings.json");
    const { settings: loadedSettings, errors } = loadSettings(settingsPath);
    if (errors.length > 0) {
      log("Settings configuration file could not be loaded:", errors);
      addLoaderError({
        source: "internal",
        severity: "warning",
        summary: "Settings configuration file could not be loaded. Defaults were used.",
        details: [...errors]
      });
    }
    setLoaderFadeOutDuration(loadedSettings.modloader.loaderFadeOutDuration);
    const loadedMods = await loadMods(MODS_DIR_PATH, loadedSettings, gameVersion);
    const settings = synchronizeSettingsWithMods(loadedSettings, loadedMods);
    saveSettings(settingsPath, settings);
    initializeSettings(loadedMods, settingsPath, settings);
    const enabledMods = loadedMods.filter((mod) => mod.enabled);
    const patches = collectPatches(enabledMods);
    initSplashMenu(patches);
    const patchableClassMap = getPatchableClasses();
    applyPatches(patches, patchableClassMap);
    updateCodex(enabledMods);
    loadStyles(enabledMods);
    onLoadMods(enabledMods);
    await finishLoader();
  }
  function init() {
    let onload = null;
    const modloaderReady = main();
    async function onloadProxy(...args) {
      try {
        await modloaderReady;
      } catch (e) {
        log("Error during modloader execution:", e);
      }
      if (typeof onload === "function") onload.apply(window, args);
    }
    window.onload = onloadProxy;
    Object.defineProperty(window, "onload", {
      get() {
        return onloadProxy;
      },
      set(fn) {
        onload = fn;
      },
      configurable: true,
      enumerable: false
    });
  }
  init();
})();
/**
 * @license MIT
 * Copyright (c) 2025 Rafał Berezin
 */
