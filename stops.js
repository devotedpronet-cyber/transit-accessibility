// Single source of truth for transit stop data.
// Real accessibility data reality (verified 2026-09-01 against live feeds):
//   - Carris Metropolitana (12,752 stops, covers Lisboa/Cascais/Oeiras/Sintra/Amadora)
//     ships wheelchair_boarding=false on every single stop (checked live, 0/12752 true).
//     No pathways.txt, no levels.txt anywhere in the Lisbon-area GTFS ecosystem. There
//     is no elevator field to source from GTFS, period.
//   - Metro de Lisboa and Transtejo/Soflusa ferries are NOT in the Carris feed at all —
//     separate operators. Their accessible stations/terminals are merged in below from
//     each operator's own authoritative source (see ACCESSIBLE_METRO_STATIONS /
//     ACCESSIBLE_FERRY_TERMINALS), not fabricated by name-matching Carris entries.
//   - Carris Metropolitana /v2/vehicles reports 96.1% of the live fleet as
//     wheelchair-accessible — a fleet-level signal, not a stop-level one.
// Given that, this module NEVER fabricates a wheelchair/elevator boolean for a stop
// whose source data doesn't have one. accessibility is one of 'known-accessible' |
// 'unknown'. Do not add an 'elevator' field back without a real source.

// Carris Metropolitana stop IDs cross-confirmed wheelchair-accessible via OSM
// (`wheelchair=yes` on a bus_stop/platform/tram_stop node within 20m of the Carris
// stop's own coordinates — Overpass API query, city-wide bbox, 2026-09-02). Carris's
// own feed ships wheelchair_boarding=false (no info) on every stop, so this is the
// only source that lets us mark these known-accessible instead of unknown. OSM tags
// are crowdsourced, not an official operator claim — lower confidence than the Metro
// station overlay above, but still a real, non-fabricated claim (someone tagged the
// specific stop as wheelchair=yes), consistent with the "never fabricate" principle.
const OSM_CONFIRMED_STOP_IDS = new Set([
  '050190', '050197', '050200', '050203', '050241', '050305', '050399', '060001', '060011', '060189',
  '060191', '060197', '060198', '060199', '060200', '060201', '060202', '060203', '060207', '060209',
  '060211', '060217', '060322', '060323', '060325', '060327', '060333', '060361', '070590', '070605',
  '070607', '071443', '071444', '071515', '071516', '071517', '110337', '170061', '170062', '170063',
  '170064', '170065', '170066', '170067', '170069', '170071', '170073', '170075', '170077', '170079',
  '170080', '170081', '170082', '170083', '170084', '170085', '170086', '170087', '170088', '170089',
  '170090', '170091', '170092', '170093', '170099', '170101', '170103', '170104', '170128', '170129',
  '170131', '170132', '170136', '170137', '170139', '170169', '170319', '171131', '171133', '171136',
  '171137', '171139', '171141', '171143', '171155', '171205', '171875', '171877', '171878', '171881',
  '171882', '171885', '171887', '171889', '171893', '171895', '171919', '172225', '172226', '172227',
  '172228', '172229', '172230', '172245', '172253', '172290', '172292', '172294', '172298', '172302',
  '172311', '172325', '172326', '172327', '172328', '172329', '172331', '172332', '172333', '172334',
  '172335', '172336', '172338', '172339', '172340', '172342', '172343', '172492', '172493', '172601',
  '7822',
]);

const STOPS_API = 'https://api.carrismetropolitana.pt/v2/stops';
const LINES_API = 'https://api.carrismetropolitana.pt/v2/lines';
const CACHE_KEY = 'stops-lisbon-v5';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h — live API, no need for a stale 7-day cache

// Metro de Lisboa stations confirmed accessible (elevators operational), per Metro de
// Lisboa's own announcements as of 2026-07-27 (47/56 stations network-wide accessible).
// Coordinates from Lisbon City Council's official ArcGIS open-data feed
// (services.arcgis.com/1dSrzEWVQn5kHHyK/.../POITransportes/FeatureServer/1). This list
// is the subset of those 47 we could positively confirm by name from Metro's own site —
// not the full 47. Extend it if a full official roster surfaces.
//
// KNOWN DISAGREEMENT (OSM cross-validation, 2026-09-02, Overpass query against
// node["station"="subway"]): OSM's wheelchair=* tag says 'no' for Colégio Militar/Luz
// and Campo Pequeno, contradicting Metro's own accessible-list below. Kept as
// known-accessible since the primary source (Metro's own announcement) outranks
// crowdsourced OSM tagging, which can go stale — but flagged here rather than
// silently picking one. Re-verify these two first if a rider ever reports a problem.
const ACCESSIBLE_METRO_STATIONS = [
  { name: 'Roma (Metro)', lat: 38.7482228024879, lon: -9.14134526152344 },
  { name: 'Colégio Militar/Luz (Metro)', lat: 38.753441421465, lon: -9.18930499007435 },
  { name: 'Rato (Metro)', lat: 38.7201575166883, lon: -9.15468780091093 },
  { name: 'Areeiro (Metro)', lat: 38.7424454415358, lon: -9.13345548142175 },
  { name: 'Arroios (Metro)', lat: 38.7328456373345, lon: -9.13423033340514 },
  { name: 'Cidade Universitária (Metro)', lat: 38.7515984207662, lon: -9.15912398203189 },
  { name: 'Entre Campos (Metro)', lat: 38.7471334577605, lon: -9.1482146104718 },
  { name: 'Baixa-Chiado (Metro)', lat: 38.7105700699041, lon: -9.14015060636417 },
  { name: 'Campo Grande (Metro)', lat: 38.7602165259205, lon: -9.1578896614592 },
  { name: 'Alameda (Metro)', lat: 38.7370549729502, lon: -9.13380942489798 },
  { name: 'Campo Pequeno (Metro)', lat: 38.740929476453, lon: -9.14668409480334 },
  { name: 'Picoas (Metro)', lat: 38.7304084282427, lon: -9.14688282452403 },
  { name: 'Praça de Espanha (Metro)', lat: 38.7377491106506, lon: -9.15925422094947 },
  { name: 'Martim Moniz (Metro)', lat: 38.7177019399986, lon: -9.13573782228017 },
  { name: 'Intendente (Metro)', lat: 38.7232980404134, lon: -9.13518490808126 },
  // Added 2026-09-02 via OSM cross-validation (Overpass, wheelchair=yes on
  // node["station"="subway"]) — not previously in our manually-confirmed 15.
  // Coordinates are OSM's own, not yet cross-checked against the ArcGIS feed above.
  { name: 'Aeroporto (Metro)', lat: 38.7684185, lon: -9.1282772 },
  { name: 'Ameixoeira (Metro)', lat: 38.779605, lon: -9.1594573 },
  { name: 'Chelas (Metro)', lat: 38.754825, lon: -9.1138702 },
  { name: 'Odivelas (Metro)', lat: 38.7932694, lon: -9.172982 },
  { name: 'Restauradores (Metro)', lat: 38.7159968, lon: -9.1423098 },
  { name: 'Santa Apolónia (Metro)', lat: 38.7136899, lon: -9.1224537 },
];

// Transtejo/Soflusa ferry terminals confirmed accessible ("Instalações adaptadas a
// mobilidade reduzida") per ttsl.pt/terminais-e-frota/terminais-e-estacoes/, 8 of 9
// listed terminals explicitly confirmed (Pedrouços/Algés excluded — no data given).
// Coordinates geocoded via Photon (same geocoder used for address search in-app).
const ACCESSIBLE_FERRY_TERMINALS = [
  { name: 'Terminal Fluvial do Barreiro', lat: 38.6519744, lon: -9.0791016 },
  { name: 'Estação Fluvial de Belém', lat: 38.6949721, lon: -9.1985325 },
  { name: 'Terminal Fluvial de Cacilhas', lat: 38.6881477, lon: -9.1476767 },
  { name: 'Terminal Fluvial do Cais do Sodré', lat: 38.7050033, lon: -9.1455288 },
  { name: 'Terminal Fluvial do Montijo (Seixalinho)', lat: 38.7003185, lon: -9.0061803 },
  { name: 'Estação Fluvial de Porto Brandão', lat: 38.6778276, lon: -9.2065707 },
  { name: 'Terminal Fluvial do Seixal', lat: 38.6475445, lon: -9.0958392 },
  { name: 'Terminal Fluvial do Terreiro do Paço', lat: 38.7068792, lon: -9.1331311 },
  { name: 'Estação Fluvial da Trafaria', lat: 38.6742699, lon: -9.2312151 },
];

function accessibleOverlayStops() {
  return [...ACCESSIBLE_METRO_STATIONS, ...ACCESSIBLE_FERRY_TERMINALS].map((s, i) => ({
    id: `accessible_overlay_${i}`,
    name: s.name,
    lat: s.lat,
    lon: s.lon,
    accessibility: 'known-accessible',
    municipality: 'Lisboa',
    lines: '',
  }));
}

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
    const merged = [...stops, ...accessibleOverlayStops()];
    setCached(merged);
    return merged;
  } catch (error) {
    console.warn('Live stop data unavailable, using bundled fixture:', error.message);
    return [...FIXTURE_STOPS.map(s => ({ ...s, isFixture: true })), ...accessibleOverlayStops()];
  }
}

async function fetchFromCarrisMetropolitana() {
  const [stopsRes, lineLabelById] = await Promise.all([
    fetch(STOPS_API).then(res => {
      if (!res.ok) throw new Error(`Carris Metropolitana API returned ${res.status}`);
      return res.json();
    }),
    fetchLineLabels(),
  ]);

  return stopsRes
    .filter(s => s.lat != null && s.lon != null)
    .map(s => ({
      id: s.id,
      name: s.long_name || s.tts_name || s.short_name || 'Unnamed stop',
      lat: Number(s.lat),
      lon: Number(s.lon),
      // wheelchair_boarding is false (no info) on every stop in this feed as of 2026-09.
      // Surface that honestly instead of rendering a fake green/red accessibility badge.
      // OSM_CONFIRMED_STOP_IDS fills 131 of these from cross-validated OSM tagging.
      accessibility: s.wheelchair_boarding === true || OSM_CONFIRMED_STOP_IDS.has(s.id)
        ? 'known-accessible'
        : 'unknown',
      municipality: s.municipality_name || '',
      lines: (s.line_ids || []).map(id => lineLabelById.get(id)).filter(Boolean).join(', '),
    }));
}

// /v2/lines' `short_name` is the rider-facing line number (e.g. "1001"); `id` is the
// same opaque ID that stops.line_ids references. Failure here isn't fatal — stops just
// render without a lines badge, same as before this join existed.
async function fetchLineLabels() {
  try {
    const res = await fetch(LINES_API);
    if (!res.ok) throw new Error(`Carris Metropolitana lines API returned ${res.status}`);
    const raw = await res.json();
    return new Map(raw.map(l => [l.id, l.short_name || l.id]));
  } catch (error) {
    console.warn('Line labels unavailable, stops will show without line numbers:', error.message);
    return new Map();
  }
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
