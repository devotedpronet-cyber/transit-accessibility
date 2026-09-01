// Mock Lisbon bus stops with accessibility info
export const mockStops = [
  { id: 1, name: "Rossio", lat: 38.7136, lon: -9.1399, stepFree: true, line: "1,2,3,91" },
  { id: 2, name: "Baixa-Chiado", lat: 38.7076, lon: -9.1422, stepFree: true, line: "28" },
  { id: 3, name: "Terreiro do Paço", lat: 38.7072, lon: -9.1310, stepFree: true, line: "15,25" },
  { id: 4, name: "Belém", lat: 38.6617, lon: -9.2040, stepFree: false, line: "14,28" },
  { id: 5, name: "Oriente", lat: 38.7674, lon: -9.0948, stepFree: true, line: "5,10,12" },
  { id: 6, name: "Príncipe Real", lat: 38.7161, lon: -9.1407, stepFree: false, line: "9,758" },
];

export function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestStepFreeStops(userLat, userLon, maxDistance = 2) {
  if (typeof userLat !== "number" || typeof userLon !== "number") {
    throw new Error("Invalid coordinates");
  }
  if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
    throw new Error("Coordinates out of range");
  }

  return mockStops
    .filter((stop) => stop.stepFree)
    .map((stop) => ({
      ...stop,
      distance: getDistance(userLat, userLon, stop.lat, stop.lon),
    }))
    .filter((stop) => stop.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}

export function formatResults(stops) {
  if (!stops || stops.length === 0) {
    return "No accessible stops found within 2km.";
  }
  return stops
    .map((stop) => `${stop.name} (${stop.distance.toFixed(2)}km) - Lines: ${stop.line}`)
    .join("\n");
}
