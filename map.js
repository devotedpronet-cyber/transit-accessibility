// Lisbon Transit Accessibility Map
// Shows step-free bus stops with accessibility ratings

const mockStops = [
  { id: 1, name: "Rossio", lat: 38.7136, lon: -9.1395, wheelchair: true, elevator: true, rating: 5 },
  { id: 2, name: "Terreiro do Paço", lat: 38.7080, lon: -9.1340, wheelchair: true, elevator: false, rating: 4 },
  { id: 3, name: "Chiado", lat: 38.7146, lon: -9.1411, wheelchair: false, elevator: false, rating: 2 },
  { id: 4, name: "Baixa-Chiado", lat: 38.7105, lon: -9.1369, wheelchair: true, elevator: true, rating: 5 },
  { id: 5, name: "Santa Apolónia", lat: 38.7224, lon: -9.1264, wheelchair: true, elevator: true, rating: 5 },
];

let map;
let markers = [];

function initMap(mapId) {
  map = L.map(mapId).setView([38.7223, -9.1393], 12); // Lisbon center

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  renderStops();
}

function renderStops() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  mockStops.forEach(stop => {
    const color = stop.rating >= 4 ? 'green' : stop.rating >= 3 ? 'orange' : 'red';
    const marker = L.circleMarker([stop.lat, stop.lon], {
      radius: 8,
      fillColor: color,
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(map);

    marker.bindPopup(`
      <b>${stop.name}</b><br/>
      Wheelchair: ${stop.wheelchair ? '✓' : '✗'}<br/>
      Elevator: ${stop.elevator ? '✓' : '✗'}<br/>
      Rating: ${stop.rating}/5
    `);

    markers.push(marker);
  });
}

function filterByAccessibility(wheelchairOnly) {
  const filtered = mockStops.filter(s => !wheelchairOnly || s.wheelchair);
  // Update markers based on filter
  renderStops();
}

export { initMap, renderStops, mockStops, filterByAccessibility };
