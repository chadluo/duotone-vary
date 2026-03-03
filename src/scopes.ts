import type { PaletteHex, TokenColorRule } from './types.js';

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
