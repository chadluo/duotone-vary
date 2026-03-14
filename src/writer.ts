import * as vscode from 'vscode';
import { buildTokenColors } from './scopes.js';
import type { PaletteHex } from './types.js';

const DARK_THEME = 'Duotone Vary Dark';
const LIGHT_THEME = 'Duotone Vary Light';

function resolveTarget(setting: 'user' | 'workspace'): vscode.ConfigurationTarget {
	if (setting === 'workspace') {
		if (!vscode.workspace.workspaceFolders?.length) {
			vscode.window.showWarningMessage(
				'Duotone Vary: No workspace open, falling back to user settings.'
			);
			return vscode.ConfigurationTarget.Global;
		}
		return vscode.ConfigurationTarget.Workspace;
	}
	return vscode.ConfigurationTarget.Global;
}

export async function applyPalette(
	darkPalette: PaletteHex | null,
	lightPalette: PaletteHex | null,
	target: 'user' | 'workspace',
): Promise<void> {
	const configTarget = resolveTarget(target);
	const config = vscode.workspace.getConfiguration();

	// Build per-theme token color customizations
	const existingToken = config.get<Record<string, unknown>>('editor.tokenColorCustomizations') ?? {};
	const tokenColors: Record<string, unknown> = { ...existingToken };
	if (darkPalette) {
		tokenColors[`[${DARK_THEME}]`] = { textMateRules: buildTokenColors(darkPalette) };
	}
	if (lightPalette) {
		tokenColors[`[${LIGHT_THEME}]`] = { textMateRules: buildTokenColors(lightPalette) };
	}
	await config.update('editor.tokenColorCustomizations', tokenColors, configTarget);
}
