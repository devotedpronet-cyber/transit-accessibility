# Mobile-First Transit App: Work Plan

## Goal
Transform transit-accessibility-planner into production iOS-first web app with real GPS + mobile UX.

## Phase 1: Mobile UX & iOS Design (Day 1)

### 1.1 iOS-Looking UI
- [ ] Safe area insets (notch + home indicator)
- [ ] Native iOS buttons (rounded, system colors)
- [ ] Haptic feedback on actions (vibration API)
- [ ] Status bar styling (dark/light mode)
- [ ] Bottom sheet for results (swipe-to-dismiss)
- [ ] Large touch targets (min 44x44pt)

### 1.2 Layout Refactor
- [ ] Full-screen map as primary view (mobile-first)
- [ ] Search overlaid as bottom sheet (not side panel)
- [ ] Search input with iOS-style search bar
- [ ] Results list as native-feeling list (sticky headers)
- [ ] Floating action buttons for actions

### 1.3 Responsive Design
- [ ] Mobile (375px): Full-screen map + bottom sheet
- [ ] Tablet (768px): Split view (map left, list right)
- [ ] Desktop: Current two-column layout
- [ ] Touch-friendly spacing everywhere

---

## Phase 2: Real GPS Integration (Day 2)

### 2.1 Geolocation API
- [ ] Request user permission (prompt → persistent)
- [ ] Get current position (latitude, longitude, accuracy)
- [ ] Watch position updates (real-time tracking)
- [ ] Handle errors (permission denied, timeout, unavailable)
- [ ] Show user location on map (blue dot)

### 2.2 Auto-Populate Coordinates
- [ ] On app load: Ask for location
- [ ] Fill lat/lon fields from GPS
- [ ] Auto-search on location grant (no button click needed)
- [ ] Show "Locating..." state during fetch

### 2.3 Location Display
- [ ] Accuracy circle on map
- [ ] "You are here" indicator
- [ ] Update map center to user location
- [ ] Option to recenter on user (floating button)

---

## Phase 3: Real Lisbon Transit Data (Day 3)

### 3.1 GTFS Integration
- [ ] Fetch Lisbon Carris/Metro GTFS from dados.gov.pt
- [ ] Parse stops.txt (id, name, lat, lon, wheelchair_boarding)
- [ ] Filter by wheelchair_boarding = 1
- [ ] Replace mockStops with real data (~300+ stops)

### 3.2 Stop Rendering
- [ ] Color code: green (wheelchair), yellow (partial), red (none)
- [ ] Show stop name + line numbers on tap
- [ ] Distance to stop (from user GPS)
- [ ] Directions link (Apple Maps, Google Maps)

### 3.3 Route Planning (Future)
- [ ] Walking route to stop
- [ ] Bus line info + schedule
- [ ] Accessibility details (elevators, ramps, etc.)

---

## Phase 4: Performance & Polish (Day 4)

### 4.1 Performance
- [ ] Lazy load map tiles
- [ ] Cache GTFS data (service worker)
- [ ] Minimize JS/CSS bundle
- [ ] Optimize for slow networks (3G)

### 4.2 Offline Support
- [ ] Cache app shell (service worker)
- [ ] Offline map view (last known location)
- [ ] Sync stops data on reconnect

### 4.3 Accessibility
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation (arrow keys, enter)
- [ ] High contrast mode support
- [ ] Screen reader testing

### 4.4 Mobile Features
- [ ] Add to home screen (PWA manifest)
- [ ] Install prompt (iOS-friendly)
- [ ] Dark mode support
- [ ] Landscape orientation support

---

## Success Criteria

### Phase 1 ✓
- [ ] iOS-looking UI on iPhone 12/13/14
- [ ] Bottom sheet for search results
- [ ] Responsive layout (mobile → desktop)
- [ ] No horizontal scroll

### Phase 2 ✓
- [ ] GPS permission prompt works
- [ ] User location displays on map
- [ ] Auto-search on location grant
- [ ] Error handling (no GPS, denied permission)

### Phase 3 ✓
- [ ] Real GTFS data loads (~300+ stops)
- [ ] Wheelchair-accessible stops filter works
- [ ] Distance calculation from user → stops
- [ ] Tap stop → show name + line info

### Phase 4 ✓
- [ ] App loads <2s on 4G
- [ ] Works offline (cached)
- [ ] PWA installable
- [ ] 100 Lighthouse score

---

## Tech Stack

**Frontend:**
- Vanilla JS (ES modules)
- Leaflet.js (map)
- Service Worker (offline)
- Geolocation API (GPS)
- PWA manifest

**Data:**
- GTFS (dados.gov.pt) — static
- Leaflet tiles — cached
- User location — real-time

**Deployment:**
- GitHub Pages (static)
- Service Worker for offline

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| GPS permission denied | Show manual entry option; remember user prefs |
| GTFS data is stale | Fetch latest on app load; cache with TTL |
| Large dataset (300+ stops) | Lazy load markers; cluster on zoom out |
| iOS notch blocking UI | Safe area CSS env vars; test on device |
| Slow network | Progressive enhancement; cache-first SW |

---

## Deliverables

1. Mobile-optimized HTML/CSS/JS
2. Real Lisbon GTFS data integration
3. GPS geolocation + real-time map
4. Service Worker (offline support)
5. PWA manifest (installable)
6. Lighthouse score >90

---

## Timeline

- **Day 1:** Mobile UX + iOS design (8 hours)
- **Day 2:** GPS integration + testing (6 hours)
- **Day 3:** GTFS data + stop rendering (6 hours)
- **Day 4:** Performance + PWA + polish (6 hours)

**Total: ~26 hours** (feasible in 3–4 days with focus)

---

## Ready for Sonnet Review

Send to Sonnet agent:
- Validate priorities (Phase 1 → Phase 2 → Phase 3 → Phase 4)
- Suggest iOS-specific UX improvements
- Flag technical risks
- Recommend quick wins vs. deep dives
- Timeline feasibility
