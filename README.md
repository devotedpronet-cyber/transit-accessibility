# Lisbon Transit Accessibility Planner

🇵🇹 [Ler em português](README.pt-PT.md)

## Contributing

This is a civic-tech project and outside contributors are welcome. See [BACKLOG.md](BACKLOG.md) for open work and [CONTRIBUTING.md](CONTRIBUTING.md) for how to get started.

## Problem

Lisbon's public transit system lacks clear accessibility information. Most GTFS feeds in the Lisbon area (Carris Metropolitana, 12,752 stops) simply don't carry reliable stop-level wheelchair data. Current transit apps don't surface that honestly, leaving users unable to confidently plan their journeys.

## Solution

A journey planner that shows nearby transit stops from live Carris Metropolitana data and labels each one honestly: **known-accessible** (confirmed by an official source or cross-validated OSM tagging) or **unknown** (no data — the vast majority). It never fabricates a false accessibility guarantee. Enter an address (or use GPS), see nearby accessible stops on a map, and get a Google Maps deep link between the nearest accessible stop at each end of your trip.

Currently confirmed accessible: 41 of 47 metro stations, 9 ferry terminals, 135 bus/tram stops (city-wide, out of 12,752 total Carris stops) — see [stops.js](stops.js) for sourcing and [issue #3](https://github.com/devotedpronet-cyber/transit-accessibility/issues/3) for the cross-validation method.

## Features

- **Live stop data**: Fetches all 12,752 stops from the Carris Metropolitana API (no API key needed), with a bundled offline fixture as fallback
- **Honest accessibility labeling**: Each stop is `known-accessible` or `unknown` — no fabricated step-free claims; unconfirmed stops are never shown on the map
- **Address search with autocomplete**: Free-text origin/destination via Photon/Komoot geocoding, or GPS
- **Nearest-accessible-stop routing**: Finds the nearest confirmed-accessible stop at each end of a trip and hands off to a Google Maps deep link for the actual transit directions
- **Mode-of-transport markers**: Bus/metro/ferry icons on the map and in results
- **Live elevator/escalator outage overlay**: `dashboard.html` shows real-time out-of-service equipment (Metro de Lisboa data via a free GitHub Actions poller); map markers warn when a stop's elevator is down
- **7-language i18n**: EN, PT-PT, FR, ES, DE, PL, UK
- **Sidewalk-routing prototype**: `sidewalkRouting.js` — a curb-cut-aware pedestrian A* prototype over real OSM data for one pilot cluster, not yet wired into the main UI (see [issue #6](https://github.com/devotedpronet-cyber/transit-accessibility/issues/6))
- **Simple UI**: No login, no signup, mobile-first bottom-sheet layout

## Quick Start

```bash
npm install
npm test           # Run tests with coverage
open index.html    # Open in browser
```

## File Structure

- `app.js` — Core logic (distance calc, nearby-stop search, result formatting)
- `stops.js` — Loads live stop data from the Carris Metropolitana API, with offline fixture fallback and the accessibility cross-validation overlays
- `map.js` / `mapColors.js` — Leaflet map rendering and accessibility/mode color-coding
- `elevatorStatus.js` — Live elevator/escalator outage polling and per-stop outage matching
- `sidewalkRouting.js` — Curb-cut-aware pedestrian A* prototype (pilot scope, see above)
- `index.html` — Main browser UI
- `dashboard.html` — Live elevator/escalator outage dashboard
- `*.test.js` — Unit tests for each module above
- `docs/ARCHITECTURE.md` — Design rationale

## Testing

Tests cover distance calculation, nearby-stop search & accessibility-aware sorting, error handling, result formatting, map rendering, elevator outage matching, and the sidewalk-routing pilot graph/pathfinding.

Coverage target: 70%+ (currently ~98%)

## CI/CD

GitHub Actions runs tests on every push to ensure quality, plus a scheduled poller for live elevator/escalator status.

## Deployment

Deploy to GitHub Pages or any static host. No backend required.

## Next Steps

See [BACKLOG.md](BACKLOG.md) and the [open issues](https://github.com/devotedpronet-cyber/transit-accessibility/issues) for current priorities — chiefly closing the remaining metro-station accessibility gap (needs a data partnership or fresh official roster) and deciding whether/how to scale the sidewalk-routing pilot city-wide.
