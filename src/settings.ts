// @ts-expect-error TS1479: colorjs.io is ESM-only; esbuild handles bundling
import Color from 'colorjs.io';
import * as vscode from 'vscode';
import type { ExtensionSettings } from './types.js';

export function parseColor(input: string): Color {
	const trimmed = input.trim().replace(/;$/, '');
	return new Color(trimmed);
}

export function readSettings(): ExtensionSettings | null {
	const config = vscode.workspace.getConfiguration('duotoneVary');
	const darkUnoColor = config.get<string>('darkUnoColor', '');
	const darkDuoColor = config.get<string>('darkDuoColor', '');
	const lightUnoColor = config.get<string>('lightUnoColor', '');
	const lightDuoColor = config.get<string>('lightDuoColor', '');
	const settingsTarget = config.get<'user' | 'workspace'>('settingsTarget', 'user');

	if ((!darkUnoColor || !darkDuoColor) && (!lightUnoColor || !lightDuoColor)) {
		return null;
	}

	return { darkUnoColor, darkDuoColor, lightUnoColor, lightDuoColor, settingsTarget };
}
