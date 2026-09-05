// Lisbon-region transit map. Stop data comes from stops.js (real Carris
// Metropolitana API, honest accessibility labeling — see stops.js header).

import { loadStops } from './stops.js';
import { colorForAccessibility, labelForAccessibility, iconForMode, labelForMode } from './mapColors.js';
import { fetchElevatorStatus, outagesForStop, outageWarning } from './elevatorStatus.js';

let map;
let markers = [];
let stops = [];
let elevatorRows = [];

async function initMap(mapId) {
  map = L.map(mapId).setView([38.7223, -9.1393], 12); // Lisbon center
  window.map = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors, Carris Metropolitana',
    maxZoom: 19,
  }).addTo(map);

  stops = await loadStops();

  // Live outage data is a nice-to-have overlay, not a dependency — if the
  // backend is unreachable, stops still render with their base accessibility
  // labeling instead of the whole map failing.
  try {
    elevatorRows = await fetchElevatorStatus();
  } catch {
    elevatorRows = [];
  }

  renderStops();
}

function renderStops() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  stops.forEach(stop => {
    const warning = outageWarning(outagesForStop(stop, elevatorRows));
    const fillColor = warning ? '#FF9500' : colorForAccessibility(stop.accessibility);

    const marker = L.circleMarker([stop.lat, stop.lon], {
      radius: 6,
      fillColor,
      color: '#fff',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.85,
    }).addTo(map);

    const lines = stop.lines ? `<br/><small>Lines: ${stop.lines}</small>` : '';
    const outage = warning ? `<br/><small>⚠ ${warning}</small>` : '';
    marker.bindPopup(`
      <b>${iconForMode(stop.mode)} ${stop.name}</b><br/>
      <small>${labelForMode(stop.mode)} · ${labelForAccessibility(stop.accessibility)}</small>${lines}${outage}
    `);

    markers.push(marker);
  });
}

export { initMap, renderStops };
export const getStops = () => stops;
