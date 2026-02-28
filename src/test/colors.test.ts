import * as assert from 'assert';
// @ts-expect-error TS1479: colorjs.io is ESM-only; esbuild handles bundling
import Color from 'colorjs.io';
import { ensureContrast, generatePalette, generateShades } from '../colors.js';

suite('generateShades', () => {
	test('returns correct count', () => {
		const base = new Color('oklch', [0.55, 0.20, 264]);
		assert.strictEqual(generateShades(base, 5, 'dark').length, 5);
		assert.strictEqual(generateShades(base, 3, 'dark').length, 3);
	});

	test('shades have decreasing chroma', () => {
		const base = new Color('oklch', [0.55, 0.20, 264]);
		const shades = generateShades(base, 5, 'dark');
		const chromas = shades.map(s => s.to('oklch').oklch.c ?? 0);
		for (let i = 1; i < chromas.length; i++) {
			assert.ok(chromas[i] <= chromas[i - 1] + 0.001,
				`shade[${i}] chroma ${chromas[i]} should be <= shade[${i - 1}] chroma ${chromas[i - 1]}`);
		}
	});

	test('last shade is achromatic', () => {
		const base = new Color('oklch', [0.55, 0.20, 264]);
		const shades = generateShades(base, 5, 'dark');
		const lastC = shades[4].to('oklch').oklch.c ?? 0;
		assert.ok(lastC < 0.01, `last shade chroma should be ~0, got ${lastC}`);
	});

	test('all shades are in sRGB gamut', () => {
		const base = new Color('oklch', [0.55, 0.30, 140]);
		const shades = generateShades(base, 5, 'dark');
		for (const shade of shades) {
			assert.ok(shade.inGamut('srgb'), 'shade must be in sRGB gamut');
		}
	});

	test('contrast requirement met for dark theme', () => {
		const dark = new Color('#0D1117');
		const base = new Color('oklch', [0.30, 0.20, 264]);
		const shades = generateShades(base, 5, 'dark');
		for (const shade of shades) {
			const ratio = dark.contrastWCAG21(shade);
			assert.ok(ratio >= 3.0, `contrast ratio ${ratio.toFixed(2)} below minimum 3.0`);
		}
	});

	test('contrast requirement met for light theme', () => {
		const light = new Color('#FFFFFF');
		const base = new Color('oklch', [0.85, 0.15, 60]);
		const shades = generateShades(base, 5, 'light');
		for (const shade of shades) {
			const ratio = light.contrastWCAG21(shade);
			assert.ok(ratio >= 3.0, `contrast ratio ${ratio.toFixed(2)} below minimum 3.0`);
		}
	});
});

suite('ensureContrast', () => {
	test('does not modify a color with sufficient contrast', () => {
		const c = new Color('oklch', [0.70, 0.15, 264]);
		const result = ensureContrast(c, 'dark');
		const dark = new Color('#0D1117');
		assert.ok(dark.contrastWCAG21(result) >= 3.0);
	});

	test('adjusts a low-contrast color', () => {
		const c = new Color('oklch', [0.15, 0.10, 264]);
		const result = ensureContrast(c, 'dark');
		const dark = new Color('#0D1117');
		assert.ok(dark.contrastWCAG21(result) >= 3.0,
			`adjusted color should meet contrast, got ${dark.contrastWCAG21(result).toFixed(2)}`);
	});
});

suite('generatePalette', () => {
	test('returns 5 uno and 3 duo hex strings', () => {
		const uno = new Color('#ca0000');
		const duo = new Color('oklch(0.45 0.26 264)');
		const palette = generatePalette(uno, duo, 'dark');
		assert.strictEqual(palette.uno.length, 5);
		assert.strictEqual(palette.duo.length, 3);
	});

	test('all values are valid hex strings', () => {
		const uno = new Color('#ca0000');
		const duo = new Color('oklch(0.45 0.26 264)');
		const palette = generatePalette(uno, duo, 'dark');
		const hexRe = /^#[0-9a-f]{6}$/i;
		for (const hex of [...palette.uno, ...palette.duo]) {
			assert.match(hex, hexRe, `${hex} is not a valid hex color`);
		}
	});
});
