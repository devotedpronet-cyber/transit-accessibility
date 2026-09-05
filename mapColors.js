// Pure accessibility-to-visual mapping, split out of map.js so it's testable
// without a DOM or Leaflet — map.js itself needs both and isn't unit-tested.

export function colorForAccessibility(accessibility) {
  return accessibility === 'known-accessible' ? '#34C759' : '#8E8E93';
}

export function labelForAccessibility(accessibility) {
  return accessibility === 'known-accessible' ? 'Wheelchair accessible' : 'Accessibility unknown';
}

const MODE_ICONS = { bus: '🚌', metro: '🚇', ferry: '⛴️' };

export function iconForMode(mode) {
  return MODE_ICONS[mode] || MODE_ICONS.bus;
}

const MODE_LABELS = { bus: 'Bus', metro: 'Metro', ferry: 'Ferry' };

export function labelForMode(mode) {
  return MODE_LABELS[mode] || 'Bus';
}
