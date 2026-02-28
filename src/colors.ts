// @ts-expect-error TS1479: colorjs.io is ESM-only; esbuild handles bundling
import Color from 'colorjs.io';
import type { PaletteHex, ThemeKind } from './types.js';

const BG_DARK = new Color('#0D1117');
const BG_LIGHT = new Color('#FFFFFF');
const MIN_CONTRAST = 3.0;

function bgForKind(kind: ThemeKind): Color {
	return kind === 'dark' ? BG_DARK : BG_LIGHT;
}

function toHex(c: Color): string {
	return c.to('srgb').toString({ format: 'hex' });
}

export function ensureContrast(color: Color, kind: ThemeKind): Color {
	const bg = bgForKind(kind);
	const result = color.clone();
	const direction = kind === 'dark' ? 1 : -1; // increase L for dark, decrease for light

	let ratio = bg.contrastWCAG21(result);
	if (ratio >= MIN_CONTRAST) {
		return result;
	}

	// Binary search lightness to meet contrast
	const currentL = result.oklch.l ?? 0.5;
	let lo = kind === 'dark' ? currentL : 0;
	let hi = kind === 'dark' ? 1 : currentL;

	for (let i = 0; i < 20 && ratio < MIN_CONTRAST; i++) {
		const mid = (lo + hi) / 2;
		result.set('oklch.l', mid);

		ratio = bg.contrastWCAG21(result);
		if (ratio < MIN_CONTRAST) {
			if (direction > 0) {
				lo = mid;
			} else {
				hi = mid;
			}
		} else {
			// Found a valid L, try to get closer to original
			if (direction > 0) {
				hi = mid;
			} else {
				lo = mid;
			}
		}
	}

	return result;
}

export function generateShades(base: Color, count: number, kind: ThemeKind): Color[] {
	const oklch = base.to('oklch');
	const baseC = oklch.c ?? 0;
	const baseH = oklch.h ?? 0;
	const baseL = oklch.l ?? 0.5;

	const shades: Color[] = [];

	for (let i = 0; i < count; i++) {
		const factor = i === count - 1 ? 0 : 1 - Math.sqrt(i / (count - 1));
		const c = new Color('oklch', [baseL, baseC * factor, i === count - 1 ? 0 : baseH]);
		c.toGamut({ space: 'srgb' });
		shades.push(ensureContrast(c, kind));
	}

	return shades;
}

export function generatePalette(uno: Color, duo: Color, kind: ThemeKind): PaletteHex {
	const unoShades = generateShades(uno, 5, kind);
	const duoShades = generateShades(duo, 3, kind);

	return {
		uno: unoShades.map(toHex) as PaletteHex['uno'],
		duo: duoShades.map(toHex) as PaletteHex['duo'],
	};
}
