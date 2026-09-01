// Test stops for validation
const testStops = [
  { id: 'test_1', name: 'Test Stop A', lat: 38.7136, lon: -9.1395, wheelchair: true, elevator: true },
  { id: 'test_2', name: 'Test Stop B', lat: 38.7105, lon: -9.1369, wheelchair: true, elevator: false },
  { id: 'test_3', name: 'Test Stop C', lat: 38.7080, lon: -9.1340, wheelchair: false, elevator: false }
];

describe("Stop Data Structure", () => {
  test("stops contain expected fields", () => {
    testStops.forEach(stop => {
      expect(stop).toHaveProperty("id");
      expect(stop).toHaveProperty("name");
      expect(stop).toHaveProperty("lat");
      expect(stop).toHaveProperty("lon");
      expect(stop).toHaveProperty("wheelchair");
      expect(stop).toHaveProperty("elevator");
    });
  });

  test("all stops have valid coordinates", () => {
    testStops.forEach(stop => {
      expect(stop.lat).toBeGreaterThanOrEqual(-90);
      expect(stop.lat).toBeLessThanOrEqual(90);
      expect(stop.lon).toBeGreaterThanOrEqual(-180);
      expect(stop.lon).toBeLessThanOrEqual(180);
    });
  });

  test("stops are in Lisbon region", () => {
    const lisboaLat = 38.7223;
    const lisboaLon = -9.1393;
    const tolerance = 0.1; // ~10km tolerance for metro area

    testStops.forEach(stop => {
      expect(Math.abs(stop.lat - lisboaLat)).toBeLessThan(tolerance);
      expect(Math.abs(stop.lon - lisboaLon)).toBeLessThan(tolerance);
    });
  });
});

describe("Accessibility Information", () => {
  test("stop accessibility info is boolean", () => {
    testStops.forEach(stop => {
      expect(typeof stop.wheelchair).toBe("boolean");
      expect(typeof stop.elevator).toBe("boolean");
    });
  });

  test("filtered stops are wheelchair accessible", () => {
    const accessibleStops = testStops.filter(s => s.wheelchair);

    accessibleStops.forEach(stop => {
      expect(stop.wheelchair).toBe(true);
    });
  });

  test("stops have meaningful names", () => {
    testStops.forEach(stop => {
      expect(stop.name).toBeTruthy();
      expect(stop.name.length).toBeGreaterThan(0);
    });
  });
});
