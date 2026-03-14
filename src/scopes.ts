import type { PaletteHex, TokenColorRule } from './types.js';

export function buildTokenColors(palette: PaletteHex): TokenColorRule[] {
	// uno: 0..4
	// duo: 0..2

	return [

		// uno

		{
			"name": "Comments",
			"scope": ["comment", "punctuation.definition.comment"],
			"settings": { "foreground": palette.uno[0] }
		},
		{
			"name": "Numbers, Characters",
			"scope": ["constant", "constant.character", "constant.keyword", "constant.numeric",],
			"settings": { "foreground": palette.uno[1] }
		},
		{
			"name": "Punctuation",
			"scope": "punctuation",
			"settings": { "foreground": palette.uno[2] }
		},
		{
			"name": "Strings",
			"scope": ["constant.other.symbol", "string", "string.regexp",],
			"settings": { "foreground": palette.uno[3] }
		},
		{
			"name": "Strings: Escape Sequences",
			"scope": "constant.character.escape",
			"settings": { "foreground": palette.uno[4] }
		},

		// duo

		{
			"name": "Type definitions",
			"scope": "entity.name.type",
			"settings": { "foreground": palette.duo[0] }
		},
		{
			"name": "Global definitions",
			"scope": "entity.name",
			"settings": { "foreground": palette.duo[1] }
		},

		// constants

		{
			"name": "Invalid",
			"scope": "invalid",
			"settings": {
				"foreground": "red"
			}
		},
	];
}
