// Lisbon-region transit map. Stop data comes from stops.js (real Carris
// Metropolitana API, honest accessibility labeling — see stops.js header).

import { loadStops } from './stops.js';
import { colorForAccessibility, labelForAccessibility } from './mapColors.js';

let map;
let markers = [];
let stops = [];

async function initMap(mapId) {
  map = L.map(mapId).setView([38.7223, -9.1393], 12); // Lisbon center
  window.map = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors, Carris Metropolitana',
    maxZoom: 19,
  }).addTo(map);

  stops = await loadStops();
  renderStops();
}

function renderStops() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  stops.forEach(stop => {
    const marker = L.circleMarker([stop.lat, stop.lon], {
      radius: 6,
      fillColor: colorForAccessibility(stop.accessibility),
      color: '#fff',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.85,
    }).addTo(map);

    const lines = stop.lines ? `<br/><small>Lines: ${stop.lines}</small>` : '';
    marker.bindPopup(`
      <b>${stop.name}</b><br/>
      <small>${labelForAccessibility(stop.accessibility)}</small>${lines}
    `);

    markers.push(marker);
  });
}

export { initMap, renderStops };
export const getStops = () => stops;
