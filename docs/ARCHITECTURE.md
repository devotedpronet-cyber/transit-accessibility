# Architecture

## Approach

**Lightweight, frontend-first design** minimizes dependencies and deployment complexity. User coordinates flow to core logic layer (`findNearestStepFreeStops`), which filters mock stops by accessibility flag, computes distances via Haversine formula, and returns sorted results. HTML renders via client-side module import.

## Why This Works

1. **No backend**: Eliminates server cost, scaling headaches. Mock data proves feature viability before API integration.
2. **Testable logic**: Core functions are pure (no side effects), enabling 70%+ coverage with simple unit tests.
3. **Progressive enhancement**: Hardcoded Lisbon stops enable MVP; swap mock data for real API later without refactoring.
4. **Static deployment**: Works on GitHub Pages, Netlify, any CDN. No infrastructure.
5. **Accessibility-first**: Demonstrates commitment to the problem by shipping a working solution for people who need it.

## Data Flow

```
User Input (lat/lon)
    ↓
findNearestStepFreeStops()
    ├─ Filter mockStops by stepFree == true
    ├─ Calculate distance via getDistance()
    ├─ Filter by maxDistance (2km default)
    └─ Sort by distance
    ↓
formatResults() or JSON → HTML Render
```

## Future Extensions

- **Real API**: Replace `mockStops` with live Lisbon transit data
- **Map**: Add Leaflet/Mapbox for visual stop locations
- **Preferences**: Save favorite stops, get notifications
- **Mobile**: Build PWA for offline access
