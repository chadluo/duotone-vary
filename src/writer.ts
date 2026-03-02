import * as fs from 'fs';
import * as path from 'path';
import { buildTokenColors, buildWorkbenchColors } from './scopes.js';
import type { PaletteHex, ThemeKind } from './types.js';

const themeFiles: Record<ThemeKind, string> = {
	dark: 'duotone-vary-dark.json',
	light: 'duotone-vary-light.json',
};

export async function applyPalette(
	palette: PaletteHex,
	kind: ThemeKind,
	extensionPath: string,
): Promise<void> {
	const themePath = path.join(extensionPath, 'themes', themeFiles[kind]);
	const raw = await fs.promises.readFile(themePath, 'utf-8');
	// Strip JS-style comments before parsing (theme files use JSONC)
	const theme = JSON.parse(raw.replace(/^\s*\/\/.*$/gm, ''));

	theme._palette = {
		uno: palette.uno,
		duo: palette.duo,
	};
	theme.tokenColors = buildTokenColors(palette);
	theme.colors = {
		...theme.colors,
		...buildWorkbenchColors(palette, kind),
	};

	await fs.promises.writeFile(
		themePath,
		JSON.stringify(theme, null, '\t') + '\n',
		'utf-8',
	);
}
