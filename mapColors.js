// Pure accessibility-to-visual mapping, split out of map.js so it's testable
// without a DOM or Leaflet — map.js itself needs both and isn't unit-tested.

export function colorForAccessibility(accessibility) {
  return accessibility === 'known-accessible' ? '#34C759' : '#8E8E93';
}

export function labelForAccessibility(accessibility) {
  return accessibility === 'known-accessible' ? 'Wheelchair accessible' : 'Accessibility unknown';
}
