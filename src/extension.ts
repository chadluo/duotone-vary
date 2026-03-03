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

function tryBuildPalette(unoColor: string, duoColor: string, kind: 'dark' | 'light'): PaletteHex | null {
	try {
		return generatePalette(parseColor(unoColor), parseColor(duoColor), kind);
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		vscode.window.showErrorMessage(`Duotone Vary: Invalid ${kind} color — ${msg}`);
		return null;
	}
}

async function regenerate(): Promise<void> {
	const settings = readSettings();
	if (!settings) {
		return;
	}

	const darkPalette = settings.darkUnoColor && settings.darkDuoColor
		? tryBuildPalette(settings.darkUnoColor, settings.darkDuoColor, 'dark')
		: null;
	const lightPalette = settings.lightUnoColor && settings.lightDuoColor
		? tryBuildPalette(settings.lightUnoColor, settings.lightDuoColor, 'light')
		: null;

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
