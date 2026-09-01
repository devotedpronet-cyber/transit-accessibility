# Architecture

## Approach

**Lightweight, frontend-first design** minimizes dependencies and deployment complexity. `stops.js` is the single source of truth for stop data: it fetches live from the Carris Metropolitana `/v2/stops` API (12,752 real stops, CORS-open, keyless), caches the result in `localStorage` for 24h (`stops-lisbon-v3`), and falls back to a small bundled `FIXTURE_STOPS` array if the live API is unreachable. Each stop carries an honest `accessibility: 'known-accessible' | 'unknown'` label — real GTFS data for the Lisbon area has no reliable stop-level wheelchair/step-free info, so the app never fabricates a false "inaccessible" state. User coordinates flow to `findNearestStops()` in `app.js`, which computes distances via Haversine formula, filters by max distance, and sorts (optionally accessible-first). HTML renders via client-side module import; `map.js` + `mapColors.js` render the same stop data as a Leaflet map.

## Why This Works

1. **No backend**: Eliminates server cost, scaling headaches. A free, keyless public API removes the need for any server-side proxy or auth.
2. **Testable logic**: Core functions are pure (no side effects), enabling solid coverage with simple unit tests.
3. **Honest data**: Rather than mocking a `stepFree` flag the underlying data can't support, the app surfaces `known-accessible` vs `unknown` and lets callers/renderers decide how to present that.
4. **Static deployment**: Works on GitHub Pages, Netlify, any CDN. No infrastructure.
5. **Accessibility-first**: Demonstrates commitment to the problem by shipping a working solution for people who need it.

## Data Flow

```
loadStops() [stops.js]
    ├─ Check localStorage cache (24h TTL, key stops-lisbon-v3)
    ├─ Fetch live from Carris Metropolitana /v2/stops
    └─ On failure, fall back to bundled FIXTURE_STOPS
    ↓
User Input (lat/lon)
    ↓
findNearestStops(stops, userLat, userLon, maxDistance, accessibleFirst) [app.js]
    ├─ Calculate distance via getDistance()
    ├─ Filter by maxDistance (2km default)
    └─ Sort by accessibility (optional) then distance
    ↓
formatResults() → text list, or renderStops() [map.js] → Leaflet markers
```

## Future Extensions

- **Richer accessibility data**: Source real stop-level wheelchair/elevator info as agencies publish it, beyond the ~19 metro stations + 10 ferry terminals currently known-accessible
- **Line labels**: Join `/v2/lines` to show rider-facing line numbers instead of leaving `lines` empty
- **Preferences**: Save favorite stops, get notifications
- **Mobile**: Build PWA for offline access
