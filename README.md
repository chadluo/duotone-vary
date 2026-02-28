# Duotone Vary

A replicate of [Duotone color theme](https://github.com/simurai/duotone-dark-syntax) for Atom editor, where you can
choose two color tones and the extension will generate the full color scheme from them.

Color theme inspired by [I am sorry, but everyone is getting syntax highlighting
wrong](https://tonsky.me/blog/syntax-highlighting/) and only some tokens are colored.

## Usage

> [!NOTE]
>
> Upon installation, in addition to the uno/duo colors, the extension 👉 **will also change** 👈 the following derived
> vscode settings, please backup before use:
>
> ```json5
> {
>     // provide fallback colors
>     "workbench.preferredDarkColorTheme": "Duotone Vary Dark",
>     "workbench.preferredLightColorTheme": "Duotone Vary Light",
>     // editor syntax highlight colors
>     "editor.tokenColorCustomizations": {},
>     // editor window colors
>     "workbench.colorCustomizations": {},
> }
> ```
>
> see [writer.ts](./src/writer.ts)

1. install
2. customize colors in settings, can pick OKLCH colors from [OKLCH Color Picker & Converter](https://oklch.com/)
3. win
