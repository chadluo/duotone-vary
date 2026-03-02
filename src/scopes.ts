import type { PaletteHex, ThemeKind, TokenColorRule } from './types.js';

export function buildTokenColors(palette: PaletteHex): TokenColorRule[] {
	return [
		{
			// "name": "Comments",
			"scope": [
				"comment",
				"punctuation.definition.comment"
			],
			"settings": {
				"foreground": palette.duo[0]
			}
		},
		{
			// "name": "Strings",
			"scope": [
				"string",
				"string.regexp",
				"constant.other.symbol"
			],
			"settings": {
				"foreground": palette.uno[0]
			}
		},
		{
			// "name": "Strings: Escape Sequences",
			"scope": "constant.character.escape",
			"settings": {
				"foreground": palette.uno[1]
			}
		},
		{
			// "name": "Numbers, Characters",
			"scope": [
				"constant.numeric",
				"constant.character",
				"constant.keyword",
				"constant"
			],
			"settings": {
				"foreground": palette.uno[2]
			}
		},
		{
			// "name": "Global definitions",
			"scope": "entity.name",
			"settings": {
				"foreground": palette.duo[1]
			}
		},
		{
			// "name": "Invalid",
			"scope": "invalid",
			"settings": {
				"foreground": palette.uno[4]
			}
		},
	];
}

export function buildWorkbenchColors(palette: PaletteHex, _kind: ThemeKind): Record<string, string> {
	return {
		// Interactive accent: duo[0]
		'tab.activeBorderTop': palette.duo[0],
		'activityBarBadge.background': palette.duo[0],
		// 'badge.background': palette.duo[0],
		// 'button.background': palette.duo[0],
		'focusBorder': palette.duo[0],
		'inputOption.activeBorder': palette.duo[0],
		'panelTitle.activeBorder': palette.duo[0],
		'statusBarItem.remoteBackground': palette.duo[0],

		// Bracket matching: uno[0]
		'editorBracketMatch.border': palette.uno[0],

		// Git decorations
		'gitDecoration.modifiedResourceForeground': palette.uno[1],
		'gitDecoration.addedResourceForeground': palette.duo[1],
		'gitDecoration.untrackedResourceForeground': palette.duo[2],

		// Selection / highlight with alpha
		'editor.selectionHighlightBorder': palette.duo[1] + '60',
		'editor.wordHighlightBackground': palette.duo[1] + '30',
		'editor.wordHighlightStrongBackground': palette.duo[1] + '50',

		// Scrollbar
		'scrollbarSlider.activeBackground': palette.duo[1] + '60',
		'minimapSlider.activeBackground': palette.duo[1] + '40',
	};
}
