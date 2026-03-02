import * as vscode from 'vscode';
import { buildTokenColors, buildWorkbenchColors } from './scopes.js';
import type { PaletteHex, ThemeKind } from './types.js';

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
	palette: PaletteHex,
	kind: ThemeKind,
	target: 'user' | 'workspace',
): Promise<void> {
	const configTarget = resolveTarget(target);
	const config = vscode.workspace.getConfiguration();

	// Merge token color customizations
	const existingToken = config.get<Record<string, unknown>>('editor.tokenColorCustomizations') ?? {};
	const tokenColors = {
		...existingToken,
		textMateRules: buildTokenColors(palette),
	};
	await config.update('editor.tokenColorCustomizations', tokenColors, configTarget);

	// Merge workbench color customizations
	const existingWorkbench = config.get<Record<string, string>>('workbench.colorCustomizations') ?? {};
	const workbenchColors = {
		...existingWorkbench,
		...buildWorkbenchColors(palette, kind),
	};
	await config.update('workbench.colorCustomizations', workbenchColors, configTarget);

	// Set preferred color themes so auto dark/light mode picks up Duotone Vary
	await config.update('workbench.preferredDarkColorTheme', 'Duotone Vary Dark', configTarget);
	await config.update('workbench.preferredLightColorTheme', 'Duotone Vary Light', configTarget);
}
