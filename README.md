# Sixty Four Mods

A collection of my mods for game [Sixty Four](https://store.steampowered.com/app/2659900/Sixty_Four/).

These require the [auto loader](https://gist.github.com/NamelessCoder/26be6b5db7480de09f9dfb9e80dee3fe#file-autoloader-js).
More information on modding this game [HERE](https://sixtyfour.game-vault.net/wiki/Modding:Index).

## Mods

- **No Hud**: Allows to hide the hud (_the 'chat' and shop_) by pressing <kbd>H</kbd>, and **optionally** hide:
  - **Resources**: resource bar and resource transfers,
  - **Cursor**: cursor and (_most of_) it's related visuals.
- **Dynamic background**: Allows to change the background color. (_default: #24242c_)
- **Dynamic prices**: Allows to scale the base price and the price increase rate of the machines. (_slows the price increase rate by default_)

## Additional Information

For the **Dynamic Background** mod, to change the background under the machines, you also need the [sprite overrides](https://github.com/RafalBerezin/Sixty_Four_Mods/blob/master/dynamic_background_sprite_overrides.zip).
Extract the contents of this zip archive into the mods folder.
The folder structure should look like this:

```
game/
└── mods/
    ├── dynamic_background.js
    └── db_sprite_overrides/
        └── [.png files]
```
