# Sixty Four Mods

A collection of my mods for game [Sixty Four](https://store.steampowered.com/app/2659900/Sixty_Four/).

> [!IMPORTANT]
> These require the [Mod Autoloader](https://gist.github.com/NamelessCoder/26be6b5db7480de09f9dfb9e80dee3fe#file-autoloader-js).

You can find more information on modding this game [HERE](https://sixtyfour.game-vault.net/wiki/Modding:Index).

## My Mods

This is just a small overview. Read more in the individual mods' README.

- **[No Hud](https://github.com/RafalBerezin/Sixty_Four_Mods/tree/master/No_HUD)**: Allows to hide the hud by pressing <kbd>H</kbd>.
- **[Dynamic background](https://github.com/RafalBerezin/Sixty_Four_Mods/tree/master/Dynamic_Background)**: Allows to change the background color.
- **[Dynamic prices](https://github.com/RafalBerezin/Sixty_Four_Mods/tree/master/Dynamic_Prices)**: Allows to scale the base prices and their increase rate.
- **[Industrial Furnace](https://github.com/RafalBerezin/Sixty_Four_Mods/tree/master/Industrial_Furnace)**: Adds an upgrade to **Beta-Pylene Oxidizer**, which is far more efficient.

> [!NOTE]
> Didn't find what you're looking for? Check out the [modding wiki](https://sixtyfour.game-vault.net/wiki/Modding:Index) to find other mods.



## How To Install

1. Go to the game folder
   - Go to **Steam Library**
   - Right click the game
   - Under **Manage** tab click on **Browse Local Files**
   - Go to **win-unpacked/resources/app/game**
2. Create **mods** folder
3. Install the Mod Autoloader if you don't have it
   - Download the [Mod Autoloader](https://gist.github.com/NamelessCoder/26be6b5db7480de09f9dfb9e80dee3fe#file-_readme-md)
   - Place the **autoloader.js** file into the **mods** folder
   - Open the **index.html** in the **game** folder
   - Import the autoloader.js file.

      <details>
      <summary><b>Click here for detailed guide on this step</b></summary>
   
      At the top of the file you will see a lot of `<script ... ></script>` tags.
   
      Paste this `<script type="text/javascript" src="mods/autoloader.js"></script>` under the last script tag.
   
      It should look somewhat like this:
   
      ```html
      <script type="text/javascript" src="scripts/codex.js?v=2"></script>
      <script type="text/javascript" src="scripts/game.js?v=4"></script>
      <!-- <script type="text/javascript" src="scripts/post.js?v=3"></script> -->
   
      <!-- The mod autloader -->
      <script type="text/javascript" src="mods/autoloader.js"></script>
      ```
      </details>

4. Download the mods that you want (the **.js** files) and place them into the **mods** folder created in **step 2**.
5. Some mods may require additional stuff. Just make sure to read the given information on the individual mods page or stuff at the top of the mod file.
