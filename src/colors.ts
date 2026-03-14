/*

Color calculation logic coming from Duotone Syntax by simurai

see https://github.com/simurai/duotone-dark-syntax/blob/master/lib/duotone.coffee
see https://github.com/simurai/duotone-light-syntax/blob/master/lib/duotone.coffee

*/

// @ts-expect-error TS1479: colorjs.io is ESM-only; esbuild handles bundling
import Color from 'colorjs.io';
import type { PaletteHex, ThemeKind } from './types.js';

const DARK_FOREGROUND = new Color("#CCCCCC");
const DARK_BACKGROUND = new Color("#1F1F1F");
const LIGHT_FOREGROUND = new Color("#3B3B3B");
const LIGHT_BACKGROUND = new Color("#FFFFFF");

function toHex(c: Color): string {
	const hex = c.to('srgb').toString({ format: 'hex' });
	// Expand 4-char shorthand (#RGB) to 7-char (#RRGGBB) so alpha suffixes work
	if (hex.length === 4) {
		const [, r, g, b] = hex;
		return `#${r}${r}${g}${g}${b}${b}`;
	}
	return hex;
}

/** Mix two colors in Lab space (chroma.js default). */
function mix(a: Color, b: Color, ratio: number): Color {
	return a.mix(b, ratio, { space: 'lab' });
}

/**
 * Linearly interpolate through anchor colors to produce `count` evenly-spaced stops.
 * Replicates `chroma.scale([...anchors]).colors(count)`.
 */
function scale(anchors: Color[], count: number): Color[] {
	if (count === 1) {
		return [anchors[0].clone()];
	}
	const segments = anchors.length - 1;
	const result: Color[] = [];
	for (let i = 0; i < count; i++) {
		const t = i / (count - 1); // 0..1
		const pos = t * segments; // position along anchor array
		const seg = Math.min(Math.floor(pos), segments - 1);
		const local = pos - seg; // 0..1 within segment
		result.push(mix(anchors[seg], anchors[seg + 1], local));
	}
	return result;
}

export function generatePalette(uno: Color, duo: Color, kind: ThemeKind): PaletteHex {
	let unoColors: Color[];
	let duoColors: Color[];

	if (kind === 'dark') {
		const unoHigh = mix(uno, DARK_FOREGROUND, 0.5);
		const unoMid = uno;
		const unoLow = mix(uno, DARK_BACKGROUND, 0.75);
		unoColors = scale([unoHigh, unoMid, unoLow], 5);

		const duoHigh = duo;
		const duoLow = mix(duo, DARK_BACKGROUND, 0.66);
		duoColors = scale([duoHigh, duoLow], 3);
	} else {
		const unoHigh = mix(uno, LIGHT_FOREGROUND, 0.3);
		const unoMid = uno;
		const unoLow = mix(uno, LIGHT_BACKGROUND, 0.6);
		unoColors = scale([unoHigh, unoMid, unoLow], 5);

		const duoHigh = mix(duo, LIGHT_FOREGROUND, 0.5);
		const duoMid = duo;
		const duoLow = mix(duo, LIGHT_BACKGROUND, 0.6);
		const duoFull = scale([duoHigh, duoMid, duoLow], 5);
		duoColors = [duoFull[1], duoFull[2], duoFull[3]];
	}

	return {
		uno: unoColors.map(toHex) as PaletteHex['uno'],
		duo: duoColors.map(toHex) as PaletteHex['duo'],
	};
}
