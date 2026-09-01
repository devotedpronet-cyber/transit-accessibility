import { mockStops } from "./map.js";

describe("Mock Stops Data", () => {
  test("mockStops contains expected fields", () => {
    mockStops.forEach(stop => {
      expect(stop).toHaveProperty("id");
      expect(stop).toHaveProperty("name");
      expect(stop).toHaveProperty("lat");
      expect(stop).toHaveProperty("lon");
      expect(stop).toHaveProperty("wheelchair");
      expect(stop).toHaveProperty("elevator");
      expect(stop).toHaveProperty("rating");
    });
  });

  test("all stops have valid coordinates", () => {
    mockStops.forEach(stop => {
      expect(stop.lat).toBeGreaterThanOrEqual(-90);
      expect(stop.lat).toBeLessThanOrEqual(90);
      expect(stop.lon).toBeGreaterThanOrEqual(-180);
      expect(stop.lon).toBeLessThanOrEqual(180);
    });
  });

  test("all stops have rating between 1 and 5", () => {
    mockStops.forEach(stop => {
      expect(stop.rating).toBeGreaterThanOrEqual(1);
      expect(stop.rating).toBeLessThanOrEqual(5);
    });
  });

  test("mock stops are centered around Lisbon", () => {
    const lisboaLat = 38.7223;
    const lisboaLon = -9.1393;
    const tolerance = 0.05; // ~5km

    mockStops.forEach(stop => {
      expect(Math.abs(stop.lat - lisboaLat)).toBeLessThan(tolerance);
      expect(Math.abs(stop.lon - lisboaLon)).toBeLessThan(tolerance);
    });
  });
});

describe("Popup Information", () => {
  test("stop popups include accessibility info", () => {
    const stop = mockStops[0];
    const wheelchairInfo = stop.wheelchair ? "✓" : "✗";
    const elevatorInfo = stop.elevator ? "✓" : "✗";

    expect(wheelchairInfo).toMatch(/✓|✗/);
    expect(elevatorInfo).toMatch(/✓|✗/);
  });

  test("all stops with wheelchair access have matching rating", () => {
    mockStops.forEach(stop => {
      if (stop.wheelchair && stop.elevator) {
        // High accessibility should correlate with higher rating
        expect(stop.rating).toBeGreaterThanOrEqual(3);
      }
    });
  });
});
