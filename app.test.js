import { findNearestStepFreeStops, formatResults, getDistance } from "./app.js";

describe("getDistance", () => {
  test("calculates distance between two coordinates", () => {
    const dist = getDistance(38.7136, -9.1399, 38.7076, -9.1422);
    expect(dist).toBeGreaterThan(0);
    expect(dist).toBeLessThan(1);
  });
});

describe("findNearestStepFreeStops", () => {
  test("returns stops filtered and sorted by distance", () => {
    const results = findNearestStepFreeStops(38.7136, -9.1399);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].wheelchair).toBe(true);
    expect(results[0].distance <= results[results.length - 1].distance).toBe(true);
  });

  test("throws error on invalid coordinates", () => {
    expect(() => findNearestStepFreeStops("invalid", -9.1399)).toThrow("Invalid coordinates");
    expect(() => findNearestStepFreeStops(91, -9.1399)).toThrow("Coordinates out of range");
    expect(() => findNearestStepFreeStops(38.7136, 181)).toThrow("Coordinates out of range");
  });

  test("filters stops within max distance", () => {
    const results = findNearestStepFreeStops(38.7136, -9.1399, 0.5);
    results.forEach((stop) => {
      expect(stop.distance).toBeLessThanOrEqual(0.5);
    });
  });
});

describe("formatResults", () => {
  test("formats results as readable text", () => {
    const results = findNearestStepFreeStops(38.7136, -9.1399);
    const formatted = formatResults(results);
    expect(formatted).toContain("km");
    expect(formatted).toContain("Lines:");
  });

  test("returns message for empty results", () => {
    const formatted = formatResults([]);
    expect(formatted).toBe("No accessible stops found within 2km.");
  });
});
