# Contexts

The functions you specify will receive different types of context objects from
the Mod Loader. All contexts are **read-only**.

Here's a quick explanation of the different types of contexts:

## Mod Context

Received by mod methods:

- `getPatches`
- `updateCodex`
- `updateWords`
- `getStyles`
- `onLoad`

Contains:

- `settings` - Configured values for your settings. More on that in
  [Settings](./04-settings.md)

## Self Context

Received by method patches of types:

- `replace`
- `observe`

Contains:

- `self` - Reference to the instance of the class the patch triggered for. Use
  in place of the `this` keyword in method patches`

## Patch Context

Received by method patches of types :

- `wrap`

Contains:

- `self` - Reference to the instance of the class the patch triggered for. Use
  in place of the `this` keyword in method patches`
- `original` - The original method being wrapped.

> [!IMPORTANT]
>
> Patches of type `wrap` **MUST** call the `original` method received in the
> context.

## Next

- [Settings](./04-settings.md)
- [Updating Codex](./05-updating-codex.md)
- [Updating Words](./06-updating-words.md)
- [Patching Methods](./07-patching-methods.md)
