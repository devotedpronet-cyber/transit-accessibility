// Lisbon transit stop data — single source of truth for both the map and the list.
//
// This is a hand-curated list, not a live GTFS feed. Carris Metropolitana's
// GTFS feed ships no pathways.txt and no levels.txt, so there is no upstream
// per-stop accessibility API to call yet. Each entry's `wheelchair` flag was
// verified by hand against operator info; there is no `elevator` field
// because no upstream source backs one.

export const STOPS = [
  { id: 'carris_1', name: 'Rossio', lat: 38.7136, lon: -9.1395, wheelchair: true, lines: '9E, 36, 83' },
  { id: 'carris_2', name: 'Marquês de Pombal', lat: 38.7224, lon: -9.1498, wheelchair: true, lines: '2, 7, 9, 13' },
  { id: 'carris_3', name: 'Cais do Sodré', lat: 38.7065, lon: -9.1425, wheelchair: true, lines: '9E, 28, 777' },
  { id: 'carris_4', name: 'Terreiro do Paço', lat: 38.7080, lon: -9.1340, wheelchair: true, lines: '9E, 15, 35' },
  { id: 'carris_5', name: 'Baixa-Chiado', lat: 38.7105, lon: -9.1369, wheelchair: true, lines: '9E, 28' },
  { id: 'carris_6', name: 'Santa Apolónia', lat: 38.7224, lon: -9.1264, wheelchair: true, lines: '9E, 12, 104' },
  { id: 'carris_8', name: 'Príncipe Real', lat: 38.7175, lon: -9.1426, wheelchair: true, lines: '9E, 758' },
  { id: 'carris_10', name: 'Estação Oriente', lat: 38.7637, lon: -9.0972, wheelchair: true, lines: '5, 707, 750' },
];

const GTFS_CACHE_KEY = 'gtfs-lisbon-stops';
const GTFS_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function loadAccessibleStops() {
  const cached = getCachedStops();
  if (cached) return cached;

  cacheStops(STOPS);
  return STOPS;
}

function getCachedStops() {
  try {
    const cached = localStorage.getItem(GTFS_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    if (age < GTFS_CACHE_TTL) {
      return data;
    }

    localStorage.removeItem(GTFS_CACHE_KEY);
    return null;
  } catch (error) {
    console.warn('Cache read error:', error);
    return null;
  }
}

function cacheStops(stops) {
  try {
    localStorage.setItem(GTFS_CACHE_KEY, JSON.stringify({
      data: stops,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Cache write error:', error);
    // Fail silently; continue with in-memory stops
  }
}
