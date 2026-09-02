# Architecture

## Approach

**Lightweight, frontend-first design** minimizes dependencies and deployment complexity. Both the list and the map read from one hand-curated stop dataset (`gtfs.js`'s `STOPS`). User coordinates flow to core logic layer (`findNearestStepFreeStops`), which filters those stops by the `wheelchair` accessibility flag, computes distances via Haversine formula, and returns sorted results. The map (`map.js`) renders the same `STOPS` array as markers via Leaflet. HTML renders via client-side module import.

## Why This Works

1. **No backend**: Eliminates server cost, scaling headaches. Hand-curated data proves feature viability before a live feed exists.
2. **Testable logic**: Core functions are pure (no side effects), enabling 70%+ coverage with simple unit tests.
3. **Single source of data**: List and map both import from `gtfs.js`, so they can't disagree on coordinates or accessibility status.
4. **Static deployment**: Works on GitHub Pages, Netlify, any CDN. No infrastructure.
5. **Accessibility-first**: Demonstrates commitment to the problem by shipping a working solution for people who need it.

## Data Flow

```
User Input (lat/lon)
    ↓
findNearestStepFreeStops()
    ├─ Filter gtfs.js's STOPS by wheelchair == true
    ├─ Calculate distance via getDistance()
    ├─ Filter by maxDistance (2km default)
    └─ Sort by distance
    ↓
formatResults() or JSON → HTML Render
```

## Data source note

`gtfs.js` is a hand-curated list, not a live GTFS feed integration. Carris Metropolitana's published GTFS feed has no `pathways.txt`/`levels.txt`, so there is no upstream API this app currently calls for accessibility data — `wheelchair` flags were checked by hand. There is no `elevator` field, since no upstream source backs one.

## Future Extensions

- **Real API**: Replace the hand-curated `STOPS` list with a live Lisbon transit data feed
- **Map**: ~~Add Leaflet/Mapbox for visual stop locations~~ (done — see `map.js`)
- **Preferences**: Save favorite stops, get notifications
- **Mobile**: Build PWA for offline access
