import { STOPS } from "./gtfs.js";

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

  return STOPS
    .filter((stop) => stop.wheelchair)
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
    .map((stop) => `${stop.name} (${stop.distance.toFixed(2)}km) - Lines: ${stop.lines}`)
    .join("\n");
}
