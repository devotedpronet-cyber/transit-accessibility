import { colorForAccessibility, labelForAccessibility, iconForMode, labelForMode } from './mapColors.js';

describe('colorForAccessibility', () => {
  test('known-accessible is green', () => {
    expect(colorForAccessibility('known-accessible')).toBe('#34C759');
  });

  test('unknown is grey', () => {
    expect(colorForAccessibility('unknown')).toBe('#8E8E93');
  });
});

describe('labelForAccessibility', () => {
  test('known-accessible label', () => {
    expect(labelForAccessibility('known-accessible')).toBe('Wheelchair accessible');
  });

  test('unknown label', () => {
    expect(labelForAccessibility('unknown')).toBe('Accessibility unknown');
  });
});

describe('iconForMode', () => {
  test('bus', () => {
    expect(iconForMode('bus')).toBe('🚌');
  });

  test('metro', () => {
    expect(iconForMode('metro')).toBe('🚇');
  });

  test('ferry', () => {
    expect(iconForMode('ferry')).toBe('⛴️');
  });

  test('unrecognized mode falls back to bus icon', () => {
    expect(iconForMode('spaceship')).toBe('🚌');
  });

  test('undefined mode falls back to bus icon', () => {
    expect(iconForMode(undefined)).toBe('🚌');
  });
});

describe('labelForMode', () => {
  test('bus', () => {
    expect(labelForMode('bus')).toBe('Bus');
  });

  test('metro', () => {
    expect(labelForMode('metro')).toBe('Metro');
  });

  test('ferry', () => {
    expect(labelForMode('ferry')).toBe('Ferry');
  });

  test('unrecognized mode falls back to Bus label', () => {
    expect(labelForMode('spaceship')).toBe('Bus');
  });
});
