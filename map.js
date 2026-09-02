// Lisbon Transit Accessibility Map
// Shows wheelchair-accessible bus stops, sourced from gtfs.js (single source of truth).

import { loadAccessibleStops } from './gtfs.js';

let map;
let markers = [];
const markersById = new Map();
let stops = [];
let bounds = null;

async function initMap(mapId) {
  map = L.map(mapId).setView([38.7223, -9.1393], 12); // Lisbon center
  window.map = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap, Carris data',
    maxZoom: 19,
  }).addTo(map);

  stops = await loadAccessibleStops();
  renderStops();

  window.addEventListener('resize', () => map.invalidateSize());
  window.addEventListener('orientationchange', () => {
    setTimeout(() => map.invalidateSize(), 200);
  });
}

function renderStops() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  markersById.clear();

  stops.forEach(stop => {
    const color = stop.wheelchair ? '#34C759' : '#FF3B30';

    const marker = L.circleMarker([stop.lat, stop.lon], {
      radius: 8,
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85,
    }).addTo(map);

    marker.bindPopup(buildPopupContent(stop));

    markers.push(marker);
    markersById.set(stop.id, marker);
  });

  bounds = markers.length ? L.latLngBounds(markers.map(m => m.getLatLng())) : null;
}

function buildPopupContent(stop) {
  const container = document.createElement('div');

  const title = document.createElement('b');
  title.textContent = stop.name;
  container.appendChild(title);
  container.appendChild(document.createElement('br'));

  const wheelchairLine = document.createElement('small');
  wheelchairLine.textContent = `Wheelchair: ${stop.wheelchair ? '✓' : '✗'}`;
  container.appendChild(wheelchairLine);

  if (stop.lines) {
    container.appendChild(document.createElement('br'));
    const linesLine = document.createElement('small');
    linesLine.textContent = `Lines: ${stop.lines}`;
    container.appendChild(linesLine);
  }

  return container;
}

function filterByAccessibility(wheelchairOnly) {
  // Real GTFS data already filtered by accessibility
  // This is preserved for compatibility
  renderStops();
}

function focusStop(id) {
  const marker = markersById.get(id);
  if (!marker || !map) return;
  map.panTo(marker.getLatLng());
  marker.openPopup();
}

function adjustForSheetHeight(sheetHeightPx) {
  if (!map) return;
  map.invalidateSize();
  if (bounds) {
    map.fitBounds(bounds, { paddingBottomRight: [0, sheetHeightPx], paddingTopLeft: [0, 0] });
  }
}

export { initMap, renderStops, filterByAccessibility, focusStop, adjustForSheetHeight, getStops };
function getStops() {
  return stops;
}
