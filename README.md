# Duotone Vary

Duotone Vary is a vscode extension to generate color themes. This extension takes two tone colors and generate colors
for the full color scheme in editor.

Inspirations:

- [Duotone Dark Syntax](https://github.com/simurai/duotone-dark-syntax)
- [I am sorry, but everyone is getting syntax highlighting wrong](https://tonsky.me/blog/syntax-highlighting/)

## Logic

This extension exposes settings for the base tone colors ('Uno' and 'Duo'), generates additional colors from the two
base colors in OKLCH color space, and modify vscode settings in `workbench.colorCustomizations` to override the colors.

The base Uno and Duo colors are supposed to be the brightest colors in the colorscheme, and the generated colors should
decrease in saturation and becoming more and more neutral. For code syntax highlight, the extension should generate 4
additional shades for Uno and 2 for Duo, in total 8 colors.

For the tone color setting item, the extension should accept either CSS OKLCH color notations (e.g. `oklch(0.45 0.26
264);`) or hex RGB notations (`#ca0000`). While generating other colors, the extension should convert colors to OKLCH
color spaces if not yet, and try to keep colors in the same hue so that the tone is reserved.

The extension should respect `vscode.window.activeColorTheme.kind` to determine whether the current theme is light or
dark, and make sure the colors have adequate contrast. Assume #FFFFFF for light background and #0D1117 for dark
background.
