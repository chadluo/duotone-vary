import * as vscode from 'vscode';
import { buildTokenColors } from './scopes.js';
import type { PaletteHex } from './types.js';

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
		tokenColors['[Duotone Vary Dark]'] = { textMateRules: buildTokenColors(darkPalette) };
	}
	if (lightPalette) {
		tokenColors['[Duotone Vary Light]'] = { textMateRules: buildTokenColors(lightPalette) };
	}
	await config.update('editor.tokenColorCustomizations', tokenColors, configTarget);

	// Set preferred color themes so auto dark/light mode picks up Duotone Vary
	await config.update('workbench.preferredDarkColorTheme', 'Duotone Vary Dark', configTarget);
	await config.update('workbench.preferredLightColorTheme', 'Duotone Vary Light', configTarget);
}
