# Introduction to Creating Mods

## Prerequisites

### Minimal

You just write the mod directly for distribution. Single file.

- Have the [game](https://store.steampowered.com/app/2659900/Sixty_Four/).
- Install the Mod Loader. If you haven't already, wait until you read the
  [Dev Tools](#dev-tools) section of this guide.
- Basic JavaScript knowledge.
- Ability to debug using browser DevTools.
- Text Editor (e.g. [VS Code](https://code.visualstudio.com/))

### Recommended

For better type safety, hints and code completions. Needs to be transpiled. If
splitting source code into multiple files, it also needs to be bundled.

- Basic TypeScript and CSS knowledge.
- [Node.js](https://nodejs.org) installed.
- Familiarity with build tools (`tsc`, `esbuild`, etc.).

> Later sections of this guide will walk you through everything you need.

## Dev Tools

The Dev Tools make writing and debugging mods much easier. When enabled, you can
press `Ctrl + Shift + I` while in game to open them.

The Mod Loader handles most of that automatically, but you need to make another
small modification to the game, either manually or using the installer.

### With Installer

If you're using the **Mod Loader Installer**, you can run it from terminal with
`--dev` flag to do the necessary setup for you.

```bash title=Example
./modloader-installer-linux --dev
```

> [!TIP]
>
> Use `--help` for all available options.

### Manual

1. Go to `win-unpacked/resources/app/` and open `main.js` in a text editor.
2. Append the following line at the end of the file:

   ```js
   ipcMain.on('ml-dt', () => win.webContents.openDevTools())
   ```

## Distribution

When your mod is ready:

- Host the mod file somewhere where people can download it easily.
- Add your mod to the
  [list of mods](https://sixtyfour.game-vault.net/wiki/Modding:Index#List_of_mods)
  on the wiki.
- Share in the **mods** channel on
  [discord](https://discord.com/invite/7YXd3tScqS).

## Next

- [**What are mods**](./01-what-are-mods.md)
