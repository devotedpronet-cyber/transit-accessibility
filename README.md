# Lisbon Transit Accessibility Planner

## Problem

Lisbon's public transit system lacks clear accessibility information. Most GTFS feeds in the Lisbon area (Carris Metropolitana, 12,752 stops) simply don't carry reliable stop-level wheelchair data — only 19 metro stations and 10 ferry terminals have a confirmed "accessible" flag. Current transit apps don't surface that honestly, leaving users unable to confidently plan their journeys.

## Solution

A journey planner that shows nearby transit stops from live Carris Metropolitana data and labels each one honestly: **known-accessible** (confirmed wheelchair boarding) or **unknown** (no data — the vast majority). It never fabricates a false accessibility guarantee. Input your coordinates, see nearby stops on a map, sorted with known-accessible stops first.

## Features

- **Live stop data**: Fetches all 12,752 stops from the Carris Metropolitana API (no API key needed), with a bundled offline fixture as fallback
- **Honest accessibility labeling**: Each stop is `known-accessible` or `unknown` — no fabricated step-free claims
- **Nearby stop search**: Find stops within a configurable distance (default 2km), known-accessible stops sorted first
- **Map view**: Leaflet map with color-coded markers (gray for unknown, never a false-negative red)
- **Distance calculation**: Real-time distance from your location
- **Simple UI**: No login, no signup, instant results

## Quick Start

```bash
npm install
npm test           # Run tests with coverage
open index.html    # Open in browser
```

## File Structure

- `app.js` — Core logic (distance calc, nearby-stop search, result formatting)
- `app.test.js` — Unit tests
- `stops.js` — Loads live stop data from the Carris Metropolitana API, with offline fixture fallback
- `map.js` — Leaflet map rendering
- `mapColors.js` — Accessibility-to-color/label mapping for map markers
- `map.test.js` — Map rendering tests
- `index.html` — Browser UI
- `docs/ARCHITECTURE.md` — Design rationale

## Testing

Tests cover:
- Distance calculation accuracy
- Nearby-stop search & accessibility-aware sorting
- Error handling for invalid coordinates
- Result formatting

Coverage target: 70%+

## CI/CD

GitHub Actions runs tests on every push to ensure quality.

## Deployment

Deploy to GitHub Pages or any static host. No backend required.

## Next Steps

1. Real-time bus tracking
2. Line-number labels per stop (needs a joined `/v2/lines` lookup)
3. Broader accessibility data as upstream GTFS feeds add it
