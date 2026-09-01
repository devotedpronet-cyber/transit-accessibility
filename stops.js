// Single source of truth for transit stop data.
// Real accessibility data reality (verified 2026-09-01 against live feeds):
//   - Carris Metropolitana (12,752 stops, covers Lisboa/Cascais/Oeiras/Sintra/Amadora)
//     ships wheelchair_boarding="0" (unknown) on every single stop. No pathways.txt,
//     no levels.txt anywhere in the Lisbon-area GTFS ecosystem. There is no elevator
//     field to source from GTFS, period.
//   - Only two feeds have populated stop-level wheelchair_boarding=1: MTS (19 stations)
//     and Transtejo/Soflusa ferries (10 terminals). Everything else is "no information".
//   - Carris Metropolitana /v2/vehicles reports 96.1% of the live fleet as
//     wheelchair-accessible — a fleet-level signal, not a stop-level one.
// Given that, this module NEVER fabricates a wheelchair/elevator boolean for a stop
// whose source data doesn't have one. accessibility is one of 'known-accessible' |
// 'unknown'. Do not add an 'elevator' field back without a real source.

const STOPS_API = 'https://api.carrismetropolitana.pt/v2/stops';
const CACHE_KEY = 'stops-lisbon-v3';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h — live API, no need for a stale 7-day cache

// Curated fallback used only if the live API is unreachable (offline dev, API outage).
// Clearly labeled as a fixture, not presented as live data.
const FIXTURE_STOPS = [
  { id: 'fixture_1', name: 'Rossio', lat: 38.7136, lon: -9.1395, accessibility: 'unknown', municipality: 'Lisboa' },
  { id: 'fixture_2', name: 'Marquês de Pombal', lat: 38.7248, lon: -9.1499, accessibility: 'unknown', municipality: 'Lisboa' },
  { id: 'fixture_3', name: 'Cais do Sodré', lat: 38.7065, lon: -9.1454, accessibility: 'unknown', municipality: 'Lisboa' },
  { id: 'fixture_4', name: 'Baixa-Chiado', lat: 38.7106, lon: -9.1397, accessibility: 'unknown', municipality: 'Lisboa' },
  { id: 'fixture_5', name: 'Oriente', lat: 38.7679, lon: -9.0987, accessibility: 'unknown', municipality: 'Lisboa' },
];

export async function loadStops() {
  const cached = getCached();
  if (cached) return cached;

  try {
    const stops = await fetchFromCarrisMetropolitana();
    setCached(stops);
    return stops;
  } catch (error) {
    console.warn('Live stop data unavailable, using bundled fixture:', error.message);
    return FIXTURE_STOPS.map(s => ({ ...s, isFixture: true }));
  }
}

async function fetchFromCarrisMetropolitana() {
  const res = await fetch(STOPS_API);
  if (!res.ok) throw new Error(`Carris Metropolitana API returned ${res.status}`);
  const raw = await res.json();

  return raw
    .filter(s => s.lat != null && s.lon != null)
    .map(s => ({
      id: s.id,
      name: s.long_name || s.tts_name || s.short_name || 'Unnamed stop',
      lat: Number(s.lat),
      lon: Number(s.lon),
      // wheelchair_boarding is false (no info) on every stop in this feed as of 2026-09.
      // Surface that honestly instead of rendering a fake green/red accessibility badge.
      accessibility: s.wheelchair_boarding === true ? 'known-accessible' : 'unknown',
      municipality: s.municipality_name || '',
      // line_ids only carries opaque route IDs, not the rider-facing line numbers —
      // would need a joined /v2/lines lookup to show real line labels. Deferred.
      lines: '',
    }));
}

function getCached() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) return data;
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

function setCached(stops) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: stops, timestamp: Date.now() }));
  } catch {
    // Quota exceeded or unavailable — fine, just skip caching.
  }
}

export { FIXTURE_STOPS };
