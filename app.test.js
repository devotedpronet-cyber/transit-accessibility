import { findNearestStops, formatResults, getDistance } from "./app.js";

const testStops = [
  { id: 1, name: "Rossio", lat: 38.7136, lon: -9.1395, accessibility: "unknown", lines: "1,2,3" },
  { id: 2, name: "Baixa-Chiado", lat: 38.7106, lon: -9.1397, accessibility: "known-accessible", lines: "28" },
  { id: 3, name: "Belém", lat: 38.6971, lon: -9.2033, accessibility: "unknown", lines: "14,28" },
];

describe("getDistance", () => {
  test("calculates distance between two coordinates", () => {
    const dist = getDistance(38.7136, -9.1395, 38.7106, -9.1397);
    expect(dist).toBeGreaterThan(0);
    expect(dist).toBeLessThan(1);
  });

  test("returns 0 for identical coordinates", () => {
    expect(getDistance(38.7136, -9.1395, 38.7136, -9.1395)).toBe(0);
  });
});

describe("findNearestStops", () => {
  test("returns stops sorted by distance", () => {
    const results = findNearestStops(testStops, 38.7136, -9.1395);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].distance <= results[results.length - 1].distance).toBe(true);
  });

  test("does not filter by accessibility — unknown stops are included", () => {
    const results = findNearestStops(testStops, 38.7136, -9.1395);
    expect(results.some((s) => s.accessibility === "unknown")).toBe(true);
  });

  test("throws error on invalid coordinates", () => {
    expect(() => findNearestStops(testStops, "invalid", -9.1395)).toThrow("Invalid coordinates");
    expect(() => findNearestStops(testStops, 91, -9.1395)).toThrow("Coordinates out of range");
    expect(() => findNearestStops(testStops, 38.7136, 181)).toThrow("Coordinates out of range");
  });

  test("throws error when stops is not an array", () => {
    expect(() => findNearestStops(null, 38.7136, -9.1395)).toThrow("Stops must be an array");
  });

  test("filters stops within max distance", () => {
    const results = findNearestStops(testStops, 38.7136, -9.1395, 0.5);
    results.forEach((stop) => {
      expect(stop.distance).toBeLessThanOrEqual(0.5);
    });
  });
});

describe("formatResults", () => {
  test("formats results as readable text with accessibility badge", () => {
    const results = findNearestStops(testStops, 38.7136, -9.1395);
    const formatted = formatResults(results);
    expect(formatted).toContain("km");
    expect(formatted).toMatch(/Accessible|Accessibility unknown/);
  });

  test("returns message for empty results", () => {
    expect(formatResults([])).toBe("No stops found within 2km.");
  });

  test("returns message for null results", () => {
    expect(formatResults(null)).toBe("No stops found within 2km.");
  });
});
