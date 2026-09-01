// Lisbon Transit Accessibility Map
// Shows wheelchair-accessible bus stops with real GTFS data

import { loadAccessibleStops } from './gtfs.js';

let map;
let markers = [];
let stops = [];

async function initMap(mapId) {
  map = L.map(mapId).setView([38.7223, -9.1393], 12); // Lisbon center
  window.map = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap, Carris data',
    maxZoom: 19,
  }).addTo(map);

  // Load real GTFS data
  stops = await loadAccessibleStops();
  renderStops();
}

function renderStops() {
  // Clear existing markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  // Accessibility rating: wheelchair + elevator = green
  stops.forEach(stop => {
    const rating = (stop.wheelchair ? 2 : 0) + (stop.elevator ? 3 : 0);
    const color = rating >= 4 ? '#34C759' : rating >= 2 ? '#FF9500' : '#FF3B30';

    const marker = L.circleMarker([stop.lat, stop.lon], {
      radius: 8,
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85,
    }).addTo(map);

    const lines = stop.lines ? `<br/>Lines: ${stop.lines}` : '';
    marker.bindPopup(`
      <b>${stop.name}</b><br/>
      <small>Wheelchair: ${stop.wheelchair ? '✓' : '✗'}</small><br/>
      <small>Elevator: ${stop.elevator ? '✓' : '✗'}</small>${lines}
    `);

    markers.push(marker);
  });
}

function filterByAccessibility(wheelchairOnly) {
  // Real GTFS data already filtered by accessibility
  // This is preserved for compatibility
  renderStops();
}

export { initMap, renderStops, stops: () => stops, filterByAccessibility };
export const mockStops = [];
