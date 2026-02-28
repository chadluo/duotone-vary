import * as assert from 'assert';
import { buildTokenColors, buildWorkbenchColors } from '../scopes.js';
import type { PaletteHex } from '../types.js';

const mockPalette: PaletteHex = {
	uno: ['#ff0000', '#cc3333', '#996666', '#666666', '#999999'],
	duo: ['#0000ff', '#333399', '#666699'],
};

suite('buildTokenColors', () => {
	test('returns array of rules with scope and foreground', () => {
		const rules = buildTokenColors(mockPalette);
		assert.ok(Array.isArray(rules));
		assert.ok(rules.length > 0);
		for (const rule of rules) {
			assert.ok(rule.scope);
			assert.ok(rule.settings.foreground);
			assert.match(rule.settings.foreground, /^#[0-9a-f]{6}$/i);
		}
	});

	test('uses uno[0] for strings/constants', () => {
		const rules = buildTokenColors(mockPalette);
		const stringRule = rules.find(r =>
			Array.isArray(r.scope) && r.scope.includes('string')
		);
		assert.ok(stringRule);
		assert.strictEqual(stringRule!.settings.foreground, mockPalette.uno[0]);
	});

	test('uses duo[0] for definitions', () => {
		const rules = buildTokenColors(mockPalette);
		const defRule = rules.find(r =>
			Array.isArray(r.scope) && r.scope.includes('entity.name.function')
		);
		assert.ok(defRule);
		assert.strictEqual(defRule!.settings.foreground, mockPalette.duo[0]);
	});
});

suite('buildWorkbenchColors', () => {
	test('returns object with expected accent keys', () => {
		const colors = buildWorkbenchColors(mockPalette, 'dark');
		assert.ok(typeof colors === 'object');
		assert.ok('tab.activeBorderTop' in colors);
		assert.ok('focusBorder' in colors);
		assert.ok('editorBracketMatch.border' in colors);
	});

	test('uses duo[0] for primary accent', () => {
		const colors = buildWorkbenchColors(mockPalette, 'dark');
		assert.strictEqual(colors['tab.activeBorderTop'], mockPalette.duo[0]);
	});
});
