# Patching Methods

The `getPatches` function allows you to modify the game's behavior by patching
**methods of game classes**.

It receives your [Mod Context](./03-contexts.md#mod-context), and returns a
`PatchSpec`.

## What is a Patch Spec?

`PatchSpec` is simply an object that specifies what and how to modify.

It contains objects named exactly like the classes you want to patch, each
containing the patches for methods of that class.

> [!NOTE]
>
> For list of available classes and their methods see `PatchableClassMap` and
> corresponding class declarations in
> [game mappings](./01-what-are-mods.md#types)

The method patches are grouped by patch type, each with specific applications.

## Patch Types

There are currently 3 types of patches available:

- `replace` - Replace the specified method entirerly.

  ```ts
  type ReplacePatch<T, M extends Method> = (
  	ctx: SelfContext<T>,
  	...args: Parameters<M>
  ) => ReturnType<M>
  ```

  The patch function of this type:
  - Receives [Self Context](./03-contexts.md#self-context), and all the
    arguments the original method would.
  - Must return a value of the same type as the original would.

  > [!NOTE]
  >
  > Each method can only be replaced once, meaning multiple mods replacing the
  > same method are considered incompatible.

- `wrap` - Run code before and after the method, use and modify it's arguments
  and the returned value.

  ```ts title=Patch function signature
  type WrapPatch<T, M extends Method> = (
  	ctx: PatchContext<T, M>,
  	...args: Parameters<M>
  ) => ReturnType<M>
  ```

  > [!IMPORTANT]
  >
  > Patches of this type **MUST** call the `original` received in the `context`.

- `observe` - Run code after the method, and all patches of other type have run.
  Receives the original arguments the method received and the final return
  value.

  The received return value may be undefined if any errors occur during the
  other patches.

The patch groups are named respectively: `replace`, `wrap`, `observe`. These
groups contain patch functions of their respective types named like the methods
of the class they're patching.

```js
{
	ClassName: {
		wrap: {
			methodName(ctx, arg1, arg2, etc) {
				// Run some code, modify arguments...

				// Call the original and store result
				const res = ctx.original(arg1, arg2, etc)

				// Run more code, modify the return value...

				// Return value of the same type as the original
				return res
			}
		}
	}
}
```

## Example

Maybe some specific sounds are too loud to you, and you'd like to configure
their volume specifically? Let's make the volume of **hitting a cube**
configurable, as these sounds can be quite loud if many of them align.

But first, let's determine what we need to do:

- Find which sounds to modify.
- Modify the volume of a specific sound.
- Create a setting to allow configuring this volume.
- Limit the volume setting range. Negative values don't make sense, so it should
  be at least `0`, and up to `1` which means full volume.

Looking at the game's code, we can see that the `Game` class contains a method
called `playSound`, which accepts the sound `id`, `loudness`, and other
arguments we don't care about.

From inspecting the `Cube` class we can see that hit sound is tied to the
specific resource, so we need to inspect that. Now looking at the Codes, we can
see that the names of these sounds all start with `tap` followed by a number.

We know all we need, so let's get to work. First, we'll create a setting for our
volume, then write a patch that modifies the loudness value, when the id starts
with `tap`.

Here's a full mod example:

```js
module.exports = {
	id: 'quiet-cubes',
	name: 'Quiet Cubes',
	description: 'Change volume of hitting cubes',

	version: '1.0.0',
	gameVersion: '1.2.1',
	loaderVersion: '1.1.0',

	settings: {
		// Give it a distinct internal name,
		// to avoid any potential conflicts
		// with other settings you might add in the future.
		cubeHitVolume: {
			type: 'number',
			name: 'Cube Hit Sound Volume',
			// Description is optional,
			// but good to have for less obvious settings.

			// Let's make the sound quiter by default.
			default: 0.3,
			// Limit the volume to between 0 and 1.
			sanitize: (val, def) => {
				if (val < 0) {
					return 0
				}
				if (val > 1) {
					return 1
				}
				return val
			}
		}
	},

	getPatches(mctx) {
		// Save value here, to avoid typing
		// the full path multiple times.
		const volume = mctx.settings.cubeHitVolume.value

		// If out volume is 1, we're not really changing anything,
		// so we might as well skip the patching completely.
		// In such case you can just return an empty object.
		if (volume === 1) {
			return {}
		}

		return {
			// We're patching the Game class
			Game: {
				// We want to modify the arguments of a method,
				// so the wrap type is perfect for us.
				wrap: {
					// We're modifying the playSound method.
					// Our patch receives the PatchContext,
					// and all the arguments of the original function.
					playSound(ctx, id, panning, loudness, dark, forced) {
						// We only modify the loudness for the sound that start with "tap".
						if (id.startsWith('tap')) {
							// We can use our setting to multiply the loudness value.
							loudness = loudness * volume
						}

						// Then we call the original.
						// Note that this function does not take the context parameter.
						// It doesn't return anything so we're done here.
						ctx.original(id, panning, loudness, dark, forced)
					}
				}
			}
		}
	}
}
```

> [!IMPORTANT]
>
> You cannot use `this` keyword directly inside the patches. To access it's
> value use `ctx.self` instead.

## Next

- [Using Typescript](./08-using-typescript.md)
