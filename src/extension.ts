import * as vscode from 'vscode';
import { generatePalette } from './colors.js';
import { parseColor, readSettings } from './settings.js';
import type { PaletteHex } from './types.js';
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

async function regenerate(): Promise<void> {
	const settings = readSettings();
	if (!settings) {
		return;
	}

	let darkPalette: PaletteHex | null = null;
	let lightPalette: PaletteHex | null = null;

	if (settings.darkUnoColor && settings.darkDuoColor) {
		try {
			darkPalette = generatePalette(parseColor(settings.darkUnoColor), parseColor(settings.darkDuoColor), 'dark');
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			vscode.window.showErrorMessage(`Duotone Vary: Invalid dark color — ${msg}`);
		}
	}

	if (settings.lightUnoColor && settings.lightDuoColor) {
		try {
			lightPalette = generatePalette(parseColor(settings.lightUnoColor), parseColor(settings.lightDuoColor), 'light');
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			vscode.window.showErrorMessage(`Duotone Vary: Invalid light color — ${msg}`);
		}
	}

	if (!darkPalette && !lightPalette) {
		return;
	}

	await applyPalette(darkPalette, lightPalette, settings.settingsTarget);
}

const debouncedRegenerate = debounce(() => { void regenerate(); }, 200);

export function activate(context: vscode.ExtensionContext) {
	// Apply on startup
	void regenerate();

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
			void regenerate();
		}),
	);
}

export function deactivate() { }
