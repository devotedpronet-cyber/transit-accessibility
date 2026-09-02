# Lisbon Transit Accessibility Planner

## Problem

Lisbon's public transit system lacks clear accessibility information. People with mobility challenges struggle to find step-free bus stops. Current transit apps don't prioritize accessibility metadata, leaving users unable to confidently plan their journeys.

## Solution

An accessible journey planner that highlights step-free bus stops based on user location. Input your coordinates, instantly discover nearby accessible stops with service lines.

## Features

- **Step-free stop search**: Find wheelchair-accessible bus stops within 2km
- **Distance calculation**: Real-time distance from your location
- **Service lines**: See all bus lines serving each stop
- **Simple UI**: No login, no signup, instant results

## Quick Start

```bash
npm install
npm test           # Run tests with coverage
open index.html    # Open in browser
```

## File Structure

- `gtfs.js` — Hand-curated stop data (single source for both list and map); see `docs/ARCHITECTURE.md` for data source caveats
- `app.js` — Core logic (distance calc, stop filtering)
- `app.test.js` — Unit tests for `app.js`
- `map.js` — Leaflet map rendering, bottom sheet resize support
- `map.test.js` — Unit tests for `gtfs.js` and `map.js`
- `index.html` — Browser UI
- `docs/ARCHITECTURE.md` — Design rationale

## Testing

Tests cover:
- Distance calculation accuracy
- Stop filtering by accessibility & distance
- Error handling for invalid coordinates
- Result formatting

Coverage target: 70%+

## CI/CD

GitHub Actions runs tests on every push to ensure quality.

## Deployment

Deploy to GitHub Pages or any static host. No backend required.

## Next Steps

1. Real Lisbon transit data API integration
2. Map visualization
3. Real-time bus tracking
4. Accessibility ratings per stop
