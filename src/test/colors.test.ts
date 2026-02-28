import * as assert from 'assert';
// @ts-expect-error TS1479: colorjs.io is ESM-only; esbuild handles bundling
import Color from 'colorjs.io';
import { generatePalette } from '../colors.js';

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

	test('dark: uno[0] is lighter than uno[4]', () => {
		const uno = new Color('#ca0000');
		const duo = new Color('oklch(0.45 0.26 264)');
		const palette = generatePalette(uno, duo, 'dark');
		const l0 = new Color(palette.uno[0]).to('oklch').oklch.l ?? 0;
		const l4 = new Color(palette.uno[4]).to('oklch').oklch.l ?? 0;
		assert.ok(l0 > l4, `uno[0] lightness ${l0} should be > uno[4] lightness ${l4}`);
	});

	test('light: uno[0] is darker than uno[4]', () => {
		const uno = new Color('#ca0000');
		const duo = new Color('oklch(0.45 0.26 264)');
		const palette = generatePalette(uno, duo, 'light');
		const l0 = new Color(palette.uno[0]).to('oklch').oklch.l ?? 0;
		const l4 = new Color(palette.uno[4]).to('oklch').oklch.l ?? 0;
		assert.ok(l0 < l4, `uno[0] lightness ${l0} should be < uno[4] lightness ${l4}`);
	});

	test('works for light theme', () => {
		const uno = new Color('#ca0000');
		const duo = new Color('oklch(0.45 0.26 264)');
		const palette = generatePalette(uno, duo, 'light');
		assert.strictEqual(palette.uno.length, 5);
		assert.strictEqual(palette.duo.length, 3);
		const hexRe = /^#[0-9a-f]{6}$/i;
		for (const hex of [...palette.uno, ...palette.duo]) {
			assert.match(hex, hexRe, `${hex} is not a valid hex color`);
		}
	});
});
