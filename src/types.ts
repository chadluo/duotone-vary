export type ThemeKind = 'light' | 'dark';

export interface PaletteHex {
	uno: [string, string, string, string, string];
	duo: [string, string, string];
}

export interface ExtensionSettings {
	darkUnoColor: string;
	darkDuoColor: string;
	lightUnoColor: string;
	lightDuoColor: string;
	settingsTarget: 'user' | 'workspace';
}

export interface TokenColorRule {
	scope: string | string[];
	settings: { foreground: string };
}
