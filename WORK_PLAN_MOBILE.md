# Mobile-First Transit App: Work Plan

## Goal
Transform transit-accessibility-planner into production iOS-first web app with real GPS + mobile UX.

## Phase 1: Mobile UX & iOS Design (Day 1)

### 1.1 iOS-Looking UI
- [x] Safe area insets (notch + home indicator) — `env(safe-area-inset-*)` vars, applied to bottom-sheet padding
- [x] Native iOS buttons (rounded, system colors) — `--primary`/`--secondary` iOS system colors, 8px radius
- [x] Haptic feedback on actions (vibration API) — `navigator.vibrate(10)`, feature-detected (Android Chrome only; iOS Safari has no Vibration API, silently no-ops)
- [x] Status bar styling (dark/light mode) — `apple-mobile-web-app-status-bar-style` + `theme-color` meta (light/dark via `prefers-color-scheme`)
- [x] Bottom sheet for results (swipe-to-dismiss) — drag handle: >40px drag collapses/expands, <10px = tap-toggle, 10-40px = no-op (avoids jitter misfires, caught + fixed via cavecrew-reviewer)
- [x] Large touch targets (min 44x44pt) — base `button` rule, `min-height: 44px`

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

### 1.4 Accessibility & Data UX
- [x] No toggle — main results list is unconditionally filtered to `accessibility === 'known-accessible'`. Went through two stages: sort-only → real filter behind a checkbox → checkbox removed entirely, per explicit user instruction ("non-accessible i dont want on the app at all"). Do not reintroduce a toggle or an unknown-status escape hatch.
- [x] Persistent "you are here" map marker (distinct from the temporary GPS accuracy circle)
- [ ] Mode-of-transport marker differentiation (bus/tram/metro/rail/ferry) — deferred, see Backlog
- [x] OSM Notes-based accessibility crowdsourcing report link

### 1.5 Address-First Input (binding requirement, done)
- [x] Removed all lat/lon numeric inputs from the UI — address search only (Photon/Komoot geocoding, keyless, CORS-open)
- [x] "From" field with autocomplete, defaults to GPS or last-used address
- [x] "To" (destination) field, optional, also autocomplete
- [x] GPS button still available, writes into the From field as "Current location" instead of raw coordinates

---

## Phase 2: Real GPS Integration (Day 2)

### 2.1 Geolocation API
- [ ] Request user permission (prompt → persistent)
- [ ] Get current position (latitude, longitude, accuracy)
- [ ] Watch position updates (real-time tracking)
- [ ] Handle errors (permission denied, timeout, unavailable)
- [ ] Show user location on map (blue dot)

### 2.2 Auto-Populate Origin
- [ ] On app load: Ask for location
- [x] GPS success sets `window.origin` + labels the From field "Current location" (no raw lat/lon shown, per binding requirement)
- [x] Auto-search on location grant (no button click needed)
- [ ] Show "Locating..." state during fetch

### 2.3 Location Display
- [ ] Accuracy circle on map
- [ ] "You are here" indicator
- [ ] Update map center to user location
- [ ] Option to recenter on user (floating button)

---

## Phase 3: Real Lisbon Transit Data (Day 3)

### 3.1 Real Stop Data Integration ✅ DONE
- [x] Fetch live stops from Carris Metropolitana API (`https://api.carrismetropolitana.pt/v2/stops`, keyless, CORS-open, 12,752 stops)
- [x] Replace `mockStops` array with live fetch — no static GTFS parse needed
- [x] Honest-uncertainty accessibility model: `accessibility: 'known-accessible' | 'unknown'` (no fabricated `stepFree` boolean)
- [x] Removed `findNearestStepFreeStops()` — superseded by live data + `accessibility` field

### 3.2 Stop Rendering
- [ ] Color code: known-accessible vs unknown (no false "not accessible" claims)
- [ ] Show stop name + line numbers on tap
- [ ] Distance to stop (from user GPS)
- [ ] Directions link (Apple Maps, Google Maps)

### 3.3 Accessible Route Finding — DONE (binding user spec, shipped 2026-09-01)
- [x] Nearest confirmed-accessible stop to origin (`nearestAccessibleStop()` in app.js, no distance cap by design)
- [x] Nearest confirmed-accessible stop to destination (same function)
- [x] "Get directions on Google Maps" button — plain outbound deep link, `target="_blank"`, no API key, no embedding. Uses undocumented path-based URL format (`google.com/maps/dir/<lat1>,<lon1>/<lat2>,<lon2>/data=!3m1!4b1!4m4!4m3!2m1!4e4!3e3`) that force-preselects "Wheelchair accessible" transit routing — reverse-engineered from user-captured before/after URLs (2026-09-01), no public API param exists for this. This is the user's own proposed design, approved and implemented as-is — supersedes the OTP2-self-host framing below as the accepted approach for v1.
- [ ] Walking route to stop
- [ ] Bus line info + schedule
- [ ] Accessibility details (elevators, ramps, etc.)
- [ ] Full in-app journey planning (turn-by-turn, multi-leg) — would still require self-hosting OpenTripPlanner 2 or similar; out of scope for v1, the Google Maps handoff covers the actual routing need.

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

## Rejected / Out of Scope

**Google Maps Platform API integration (Directions/Geocoding APIs, embedded)** — still rejected.
- Cost risk: free tier caps as low as 1,000–10,000 calls/mo depending on SKU; real overage pricing beyond that.
- Unmitigable API key exposure on a static GitHub Pages site (no backend to guard it).
- Google ToS forbids combining Directions/Geocoding content with a non-Google basemap — would force dropping Leaflet/OSM entirely.

**What IS shipped instead**: a plain outbound link to `google.com/maps/dir/...` that opens Google Maps in a new tab. No API key, nothing embedded into the Leaflet map, so none of the three objections above apply. This is the user's own proposed design (2026-09-01) — see Phase 3.3.

## Backlog (persistent — do not drop across sessions)

- Mode-of-transport marker differentiation (bus/tram/metro/rail/ferry). Partial research done: ~52-name Metro station roster (Wikipedia), 9 ferry terminal names (WebSearch), CP rail roster incomplete. A substring name-heuristic was tried and explicitly rejected (false positives: "...ESTACIONA" matched as parking, bus stops near train stations mislabeled as rail) — do not resurrect that approach; needs real per-mode feed data or an explicit `mode` field from a joined source.
- Full official roster of all 47 accessible Metro stations (currently only 15 of 47 confirmed by name from Metro de Lisboa's own site are in `stops.js`'s `ACCESSIBLE_METRO_STATIONS` overlay — extend if a complete official list surfaces, e.g. from Metro de Lisboa's accessibility page directly rather than news articles).
- Pedrouços/Algés ferry terminal accessibility status unconfirmed (excluded from the overlay pending real data).

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
