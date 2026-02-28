import type { PaletteHex, ThemeKind, TokenColorRule } from './types.js';

export function buildTokenColors(palette: PaletteHex): TokenColorRule[] {
	return [
		// Uno[0]: constants & strings — concrete values you scan for
		{
			scope: ['string', 'constant.numeric', 'constant.language', 'constant.character'],
			settings: { foreground: palette.uno[0] },
		},
		// Uno[1]: comments — deserve visibility, not grey burial
		{
			scope: ['comment', 'punctuation.definition.comment'],
			settings: { foreground: palette.uno[1] },
		},
		// Duo[0]: definitions — names at declaration sites
		{
			scope: [
				'entity.name.function',
				'entity.name.type',
				'entity.name.class',
				'entity.name.tag',
			],
			settings: { foreground: palette.duo[0] },
		},
		// Duo[1]: attributes & properties at definition
		{
			scope: ['entity.other.attribute-name', 'support.type', 'variable.other.constant'],
			settings: { foreground: palette.duo[1] },
		},
		// Uno[4]: dimmed punctuation — separate names from syntax
		{
			scope: ['punctuation'],
			settings: { foreground: palette.uno[4] },
		},
	];
}

export function buildWorkbenchColors(palette: PaletteHex, _kind: ThemeKind): Record<string, string> {
	return {
		// Interactive accent: duo[0]
		'tab.activeBorderTop': palette.duo[0],
		'activityBarBadge.background': palette.duo[0],
		'badge.background': palette.duo[0],
		'button.background': palette.duo[0],
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
