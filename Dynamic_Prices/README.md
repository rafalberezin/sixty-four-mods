# Dynamic Prices

Allows to scale the base prices and their increase rate.

## Configuration

### Base Multiplier

Multiply the base prices by this value.

Default: **1**

---

### Scaling Multiplier

Multiply the price increase rate by this value.

Set to **0** for constant prices.

Default: **0.5**

<details>
<summary><b>The math behind price scaling</b></summary>

The prices scale exponentialy. This is the formula: `P = B * E ^ N`

```
P - Price
B - Base Price
E - Price Exponent
N - Number of machines owned
```

This mod modifies the exponent in the following way: `E = (D - 1) * M + 1`

```
E - Exponent
D - Default Exponent
M - Modifier (the one that you configure)
```
</details>

---

[Mods Installation guide](https://github.com/RafalBerezin/Sixty_Four_Mods?tab=readme-ov-file#how-to-install)
