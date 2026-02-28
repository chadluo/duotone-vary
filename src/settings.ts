// @ts-expect-error TS1479: colorjs.io is ESM-only; esbuild handles bundling
import Color from 'colorjs.io';
import * as vscode from 'vscode';
import type { ExtensionSettings } from './types.js';

export function parseColor(input: string): Color {
	const trimmed = input.trim().replace(/;$/, '');
	return new Color(trimmed);
}

export function readSettings(): ExtensionSettings | null {
	const config = vscode.workspace.getConfiguration('duotone-vary');
	const unoColor = config.get<string>('unoColor', '');
	const duoColor = config.get<string>('duoColor', '');
	const settingsTarget = config.get<'user' | 'workspace'>('settingsTarget', 'user');

	if (!unoColor || !duoColor) {
		return null;
	}

	return { unoColor, duoColor, settingsTarget };
}
