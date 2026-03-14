<!-- markdownlint-disable no-inline-html -->

# Duotone Vary

A replicate of [Duotone color theme](https://github.com/simurai/duotone-dark-syntax) for vscode, where you choose two
base colors and the extension generates other colors for a full theme.

The actual syntax highlight plan is inspired by [I am sorry, but everyone is getting syntax highlighting
wrong](https://tonsky.me/blog/syntax-highlighting/) and only some tokens are colored.

## Usage: set your own colors

> [!IMPORTANT]
>
> The extension 👉 **will change** 👈 the following settings, please ☝️ backup before use:
>
> ```json5
> {
>     // editor syntax highlight colors
>     "editor.tokenColorCustomizations": {},
> }
> ```

After installation, tweak the base colors in settings, for light/dark and uno/duo respectively:

```json5
{
    // example values
    "duotoneVary.darkDuoColor":  "oklch(0.9147 0.0987 135.48)",
    "duotoneVary.darkUnoColor":  "oklch(0.7235 0.1973 330)",
    "duotoneVary.lightDuoColor": "oklch(0.7118 0.1579 27.53)",
    "duotoneVary.lightUnoColor": "oklch(0.6206 0.1776 262.59)",
}
```

## How it works: mix colors and overrides

Typically vscode themes only change colors and don't touch settings, and extensions don't change colors. However vscode
does support overridng colors in settings, making it possible to dynamically generate colors.

This extension mixes the colors and generate the full colors. For foreground and background colors it assumes the
built-in vscode themes `Default Light Modern` and `Default Dark Modern`:

| Theme | Foreground                                         | Background                                         |
| ----- | -------------------------------------------------- | -------------------------------------------------- |
| Light | <span style="background: #3B3B3B"> </span> #3B3B3B | <span style="background: #FFFFFF"> </span> #FFFFFF |
| Dark  | <span style="background: #CCCCCC"> </span> #CCCCCC | <span style="background: #1F1F1F"> </span> #1F1F1F |

And it generates 5 Uno colorsand 3 Duo colors in total, used in:

- Uno 0: comments
- Uno 1: Numbers, Characters
- Uno 2: String escapes
- Uno 3: Strings
- Duo 0: Type definitions
- Duo 1: Other definitions

To keep editor window colors but reset the default editor color theme, it's recommended to use the modified versions:

```json5
{
    "workbench.colorTheme": "Duotone Vary Dark",
    // or use auto detect:
    "window.autoDetectColorScheme": true,
    "workbench.preferredDarkColorTheme": "Duotone Vary Dark",
    "workbench.preferredLightColorTheme": "Duotone Vary Light",
}
```
