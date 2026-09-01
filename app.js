// Distance + nearby-stop logic. Stop data itself lives in stops.js.
// NOTE: real GTFS data for the Lisbon area does not carry reliable
// stop-level wheelchair/step-free info (see stops.js header). We therefore
// no longer filter to "step-free only" — that would silently drop 12,700+
// of 12,752 stops city-wide. Instead every stop carries an honest
// accessibility label ('known-accessible' | 'unknown') and callers decide
// how to present that.

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

export function findNearestStops(stops, userLat, userLon, maxDistance = 2) {
  if (typeof userLat !== "number" || typeof userLon !== "number") {
    throw new Error("Invalid coordinates");
  }
  if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
    throw new Error("Coordinates out of range");
  }
  if (!Array.isArray(stops)) {
    throw new Error("Stops must be an array");
  }

  return stops
    .map((stop) => ({
      ...stop,
      distance: getDistance(userLat, userLon, stop.lat, stop.lon),
    }))
    .filter((stop) => stop.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}

export function formatResults(stops) {
  if (!stops || stops.length === 0) {
    return "No stops found within 2km.";
  }
  return stops
    .map((stop) => {
      const badge = stop.accessibility === 'known-accessible' ? 'Accessible' : 'Accessibility unknown';
      const lines = stop.lines ? ` - Lines: ${stop.lines}` : '';
      return `${stop.name} (${stop.distance.toFixed(2)}km) - ${badge}${lines}`;
    })
    .join("\n");
}
