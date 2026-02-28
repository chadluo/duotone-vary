export type ThemeKind = 'light' | 'dark';

export interface PaletteHex {
	uno: [string, string, string, string, string];
	duo: [string, string, string];
}

export interface ExtensionSettings {
	unoColor: string;
	duoColor: string;
	settingsTarget: 'user' | 'workspace';
}

export interface TokenColorRule {
	scope: string | string[];
	settings: { foreground: string };
}
