// @ts-expect-error TS1479: colorjs.io is ESM-only; esbuild handles bundling
import Color from 'colorjs.io';
import * as vscode from 'vscode';
import { generatePalette } from './colors.js';
import { parseColor, readSettings } from './settings.js';

import { applyPalette } from './writer.js';

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): T {
	let timer: ReturnType<typeof setTimeout> | undefined;
	return ((...args: Parameters<T>) => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => fn(...args), ms);
	}) as unknown as T;
}

async function regenerate(extensionPath: string): Promise<void> {
	const settings = readSettings();
	if (!settings) {
		return;
	}

	for (const kind of ['dark', 'light'] as const) {
		const unoRaw = kind === 'dark' ? settings.darkUnoColor : settings.lightUnoColor;
		const duoRaw = kind === 'dark' ? settings.darkDuoColor : settings.lightDuoColor;

		if (!unoRaw || !duoRaw) {
			continue;
		}

		let uno: Color;
		let duo: Color;
		try {
			uno = parseColor(unoRaw);
			duo = parseColor(duoRaw);
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			vscode.window.showErrorMessage(`Duotone Vary: Invalid ${kind} color — ${msg}`);
			continue;
		}

		const palette = generatePalette(uno, duo, kind);
		await applyPalette(palette, kind, extensionPath);
	}
}

export function activate(context: vscode.ExtensionContext) {
	const extensionPath = context.extensionPath;
	const debouncedRegenerate = debounce(() => { void regenerate(extensionPath); }, 200);

	// Apply on startup
	void regenerate(extensionPath);

	// Re-apply when settings change
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('duotone-vary')) {
				debouncedRegenerate();
			}
		}),
	);

	// Re-apply when theme kind changes (light ↔ dark)
	context.subscriptions.push(
		vscode.window.onDidChangeActiveColorTheme(() => {
			debouncedRegenerate();
		}),
	);

	// Manual regenerate command
	context.subscriptions.push(
		vscode.commands.registerCommand('duotone-vary.regenerate', () => {
			void regenerate(extensionPath);
		}),
	);
}

export function deactivate() {}
