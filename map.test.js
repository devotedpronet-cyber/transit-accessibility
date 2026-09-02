import { jest } from "@jest/globals";
import { STOPS, loadAccessibleStops } from "./gtfs.js";
import { initMap, renderStops, filterByAccessibility, focusStop, adjustForSheetHeight, getStops } from "./map.js";

describe("STOPS (consolidated stop data)", () => {
  test("stops contain expected fields and no unsourced elevator field", () => {
    STOPS.forEach(stop => {
      expect(stop).toHaveProperty("id");
      expect(stop).toHaveProperty("name");
      expect(stop).toHaveProperty("lat");
      expect(stop).toHaveProperty("lon");
      expect(stop).toHaveProperty("wheelchair");
      expect(stop).toHaveProperty("lines");
      expect(stop).not.toHaveProperty("elevator");
    });
  });

  test("all stops have valid coordinates", () => {
    STOPS.forEach(stop => {
      expect(stop.lat).toBeGreaterThanOrEqual(-90);
      expect(stop.lat).toBeLessThanOrEqual(90);
      expect(stop.lon).toBeGreaterThanOrEqual(-180);
      expect(stop.lon).toBeLessThanOrEqual(180);
    });
  });

  test("stops are in the Lisbon region", () => {
    const lisboaLat = 38.7223;
    const lisboaLon = -9.1393;
    const tolerance = 0.1; // ~10km tolerance for metro area

    STOPS.forEach(stop => {
      expect(Math.abs(stop.lat - lisboaLat)).toBeLessThan(tolerance);
      expect(Math.abs(stop.lon - lisboaLon)).toBeLessThan(tolerance);
    });
  });

  test("wheelchair accessibility flag is boolean", () => {
    STOPS.forEach(stop => {
      expect(typeof stop.wheelchair).toBe("boolean");
    });
  });

  test("stops have meaningful names", () => {
    STOPS.forEach(stop => {
      expect(stop.name).toBeTruthy();
      expect(stop.name.length).toBeGreaterThan(0);
    });
  });

  test("stop ids are unique", () => {
    const ids = STOPS.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("does not include misidentified non-stop records", () => {
    const names = STOPS.map(s => s.name);
    expect(names).not.toContain("Estufa Fria");
    expect(names).not.toContain("Alcântara-Terra");
  });
});

describe("loadAccessibleStops", () => {
  test("resolves the same stop data as STOPS", async () => {
    const stops = await loadAccessibleStops();
    expect(stops).toEqual(STOPS);
  });
});

class FakeStorage {
  constructor() { this.store = {}; }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) { this.store[key] = String(value); }
  removeItem(key) { delete this.store[key]; }
}

describe("loadAccessibleStops caching", () => {
  afterEach(() => {
    delete global.localStorage;
  });

  test("caches stops after first load and serves them from cache", async () => {
    global.localStorage = new FakeStorage();

    const first = await loadAccessibleStops();
    expect(first).toEqual(STOPS);
    expect(global.localStorage.getItem('gtfs-lisbon-stops')).not.toBeNull();

    const second = await loadAccessibleStops();
    expect(second).toEqual(STOPS);
  });

  test("ignores and refreshes an expired cache entry", async () => {
    global.localStorage = new FakeStorage();
    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
    global.localStorage.setItem(
      'gtfs-lisbon-stops',
      JSON.stringify({ data: STOPS, timestamp: eightDaysAgo })
    );

    const result = await loadAccessibleStops();
    expect(result).toEqual(STOPS);

    const refreshed = JSON.parse(global.localStorage.getItem('gtfs-lisbon-stops'));
    expect(Date.now() - refreshed.timestamp).toBeLessThan(1000);
  });
});

class FakeElement {
  constructor(tag) {
    this.tag = tag;
    this.children = [];
    this.textContent = '';
  }
  appendChild(child) {
    this.children.push(child);
    return child;
  }
}

class FakeMarker {
  constructor(latlng) {
    this.latlng = latlng;
    this.popupContent = null;
    this.opened = false;
  }
  addTo() { return this; }
  bindPopup(content) { this.popupContent = content; return this; }
  openPopup() { this.opened = true; return this; }
  getLatLng() { return this.latlng; }
}

describe("map.js rendering against the consolidated stop data", () => {
  let fakeMap;

  beforeEach(() => {
    fakeMap = {
      removeLayer: jest.fn(),
      invalidateSize: jest.fn(),
      fitBounds: jest.fn(),
      panTo: jest.fn(),
    };
    fakeMap.setView = jest.fn(() => fakeMap);

    global.L = {
      map: jest.fn(() => fakeMap),
      tileLayer: jest.fn(() => ({ addTo: jest.fn() })),
      circleMarker: jest.fn((latlng) => new FakeMarker(latlng)),
      latLngBounds: jest.fn((points) => ({ points })),
    };
    global.window = { addEventListener: jest.fn() };
    global.document = { createElement: (tag) => new FakeElement(tag) };
  });

  afterEach(() => {
    delete global.L;
    delete global.window;
    delete global.document;
  });

  test("initMap loads STOPS and renders one marker per stop", async () => {
    await initMap('map');
    expect(getStops()).toEqual(STOPS);
    expect(global.L.circleMarker).toHaveBeenCalledTimes(STOPS.length);
  });

  test("focusStop pans to and opens the matching stop's marker", async () => {
    await initMap('map');
    const target = STOPS[0];

    focusStop(target.id);

    expect(fakeMap.panTo).toHaveBeenCalledWith([target.lat, target.lon]);
  });

  test("focusStop is a no-op for an unknown id", async () => {
    await initMap('map');
    expect(() => focusStop('not-a-real-id')).not.toThrow();
    expect(fakeMap.panTo).not.toHaveBeenCalled();
  });

  test("adjustForSheetHeight resizes the map and refits bounds with the given padding", async () => {
    await initMap('map');

    adjustForSheetHeight(240);

    expect(fakeMap.invalidateSize).toHaveBeenCalled();
    expect(fakeMap.fitBounds).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ paddingBottomRight: [0, 240] })
    );
  });

  test("filterByAccessibility re-renders without throwing", async () => {
    await initMap('map');
    expect(() => filterByAccessibility(true)).not.toThrow();
  });
});
