// Distance + nearby-stop logic. Stop data itself lives in stops.js.
// NOTE: real GTFS data for the Lisbon area does not carry reliable
// stop-level wheelchair/step-free info (see stops.js header). We therefore
// no longer filter to "step-free only" — that would silently drop 12,700+
// of 12,752 stops city-wide. Instead every stop carries an honest
// accessibility label ('known-accessible' | 'unknown') and callers decide
// how to present that.

import { outagesForStop, outageWarning } from './elevatorStatus.js';

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

export function findNearestStops(stops, userLat, userLon, maxDistance = 2, accessibleFirst = true) {
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
    .sort((a, b) => {
      if (accessibleFirst) {
        const aKnown = a.accessibility === "known-accessible" ? 0 : 1;
        const bKnown = b.accessibility === "known-accessible" ? 0 : 1;
        if (aKnown !== bKnown) return aKnown - bKnown;
      }
      return a.distance - b.distance;
    });
}

// Only ~29 stops city-wide (19 metro stations + 10 ferry terminals) are
// confirmed accessible. No max-distance cap here on purpose — the honest
// answer to "nearest accessible stop" can legitimately be far away, and
// hiding that behind a radius would silently return nothing instead.
export function nearestAccessibleStop(stops, lat, lon) {
  if (typeof lat !== "number" || typeof lon !== "number") {
    throw new Error("Invalid coordinates");
  }
  if (!Array.isArray(stops)) {
    throw new Error("Stops must be an array");
  }

  const accessible = stops.filter((s) => s.accessibility === "known-accessible");
  if (accessible.length === 0) return null;

  return accessible
    .map((stop) => ({ ...stop, distance: getDistance(lat, lon, stop.lat, stop.lon) }))
    .sort((a, b) => a.distance - b.distance)[0];
}

// elevatorRows is optional live status data (see elevatorStatus.js); when
// omitted, results render exactly as before — a backend outage never breaks
// the core nearby-stops flow.
export function formatResults(stops, elevatorRows) {
  if (!stops || stops.length === 0) {
    return "No stops found within 2km.";
  }
  return stops
    .map((stop) => {
      const badge = stop.accessibility === 'known-accessible' ? 'Accessible' : 'Accessibility unknown';
      const lines = stop.lines ? ` - Lines: ${stop.lines}` : '';
      const warning = elevatorRows
        ? outageWarning(outagesForStop(stop, elevatorRows))
        : null;
      const outage = warning ? ` - ⚠ ${warning}` : '';
      return `${stop.name} (${stop.distance.toFixed(2)}km) - ${badge}${lines}${outage}`;
    })
    .join("\n");
}
