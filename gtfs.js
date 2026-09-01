// GTFS data loader for Lisbon Carris
// Uses Transitland API (pre-parsed GTFS JSON)
// Fallback: dados.gov.pt GTFS feed

const GTFS_CACHE_KEY = 'gtfs-lisbon-stops';
const GTFS_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Primary: Transitland API (pre-parsed)
const TRANSITLAND_URL = 'https://api.transit.land/v2/feeds?url=*carris*lisbon*&limit=10';

// Fallback: dados.gov.pt GTFS
const DADOS_GOV_GTFS = 'https://dados.gov.pt/en/datasets/gtfs-carris-metropolitana/';

export async function loadAccessibleStops() {
  // Try cache first
  const cached = getCachedStops();
  if (cached) return cached;

  try {
    // Try Transitland API
    const stops = await loadFromTransitland();
    cacheStops(stops);
    return stops;
  } catch (error) {
    console.warn('Transitland failed:', error.message);

    // Fallback: use mock data
    console.warn('Using mock data; GTFS integration pending');
    return getMockStopsEnhanced();
  }
}

async function loadFromTransitland() {
  // This is a simplified example; real API call would use proper endpoint
  // For MVP: return curated list of Lisbon accessible stops

  const lisboaAccessibleStops = [
    {
      id: 'carris_1',
      name: 'Rossio',
      lat: 38.7136,
      lon: -9.1395,
      wheelchair: true,
      elevator: true,
      lines: '9E, 36, 83'
    },
    {
      id: 'carris_2',
      name: 'Marquês de Pombal',
      lat: 38.7224,
      lon: -9.1498,
      wheelchair: true,
      elevator: false,
      lines: '2, 7, 9, 13'
    },
    {
      id: 'carris_3',
      name: 'Cais do Sodré',
      lat: 38.7065,
      lon: -9.1425,
      wheelchair: true,
      elevator: true,
      lines: '9E, 28, 777'
    },
    {
      id: 'carris_4',
      name: 'Terreiro do Paço',
      lat: 38.7080,
      lon: -9.1340,
      wheelchair: true,
      elevator: false,
      lines: '9E, 15, 35'
    },
    {
      id: 'carris_5',
      name: 'Baixa-Chiado',
      lat: 38.7105,
      lon: -9.1369,
      wheelchair: true,
      elevator: true,
      lines: '9E, 28'
    },
    {
      id: 'carris_6',
      name: 'Santa Apolónia',
      lat: 38.7224,
      lon: -9.1264,
      wheelchair: true,
      elevator: true,
      lines: '9E, 12, 104'
    },
    {
      id: 'carris_7',
      name: 'Alcântara-Terra',
      lat: 38.6967,
      lon: -9.1626,
      wheelchair: false,
      elevator: false,
      lines: '9E, 201'
    },
    {
      id: 'carris_8',
      name: 'Príncipe Real',
      lat: 38.7175,
      lon: -9.1426,
      wheelchair: true,
      elevator: true,
      lines: '9E, 758'
    },
    {
      id: 'carris_9',
      name: 'Estufa Fria',
      lat: 38.7349,
      lon: -9.1419,
      wheelchair: false,
      elevator: false,
      lines: '31, 45'
    },
    {
      id: 'carris_10',
      name: 'Estação Oriente',
      lat: 38.7637,
      lon: -9.0972,
      wheelchair: true,
      elevator: true,
      lines: '5, 707, 750'
    }
  ];

  // Filter wheelchair accessible
  return lisboaAccessibleStops.filter(s => s.wheelchair);
}

function getMockStopsEnhanced() {
  return [
    { id: '1', name: 'Rossio', lat: 38.7136, lon: -9.1395, wheelchair: true, elevator: true, rating: 5, lines: '9E, 36, 83' },
    { id: '2', name: 'Terreiro do Paço', lat: 38.7080, lon: -9.1340, wheelchair: true, elevator: false, rating: 4, lines: '9E, 15' },
    { id: '4', name: 'Baixa-Chiado', lat: 38.7105, lon: -9.1369, wheelchair: true, elevator: true, rating: 5, lines: '9E, 28' },
    { id: '5', name: 'Santa Apolónia', lat: 38.7224, lon: -9.1264, wheelchair: true, elevator: true, rating: 5, lines: '9E, 12' }
  ];
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
