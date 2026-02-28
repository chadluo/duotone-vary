import * as assert from 'assert';
import { parseColor } from '../settings.js';

suite('parseColor', () => {
	test('parses hex color', () => {
		const c = parseColor('#ca0000');
		assert.ok(c.inGamut('srgb'));
	});

	test('parses oklch CSS string', () => {
		const c = parseColor('oklch(0.45 0.26 264)');
		const [l, ch, h] = c.oklch;
		assert.ok(Math.abs((l ?? 0) - 0.45) < 0.01);
		assert.ok(Math.abs((ch ?? 0) - 0.26) < 0.01);
		assert.ok(Math.abs((h ?? 0) - 264) < 1);
	});

	test('handles trailing semicolons', () => {
		const c = parseColor('oklch(0.45 0.26 264);');
		assert.ok(c);
	});

	test('throws on invalid input', () => {
		assert.throws(() => parseColor('not-a-color'));
	});
});
