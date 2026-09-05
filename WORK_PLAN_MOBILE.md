# Mobile-First Transit App: Work Plan

## Goal
Make transit-accessibility-planner into real iOS-first web app. Real GPS. Mobile UX.

## Phase 1: Mobile UX & iOS Design (Day 1)

### 1.1 iOS-Looking UI
- [x] Safe area insets (notch + home bar) — `env(safe-area-inset-*)` vars, go on bottom-sheet padding
- [x] Native iOS buttons (round, system colors) — `--primary`/`--secondary` iOS system colors, 8px radius
- [x] Haptic buzz on actions (vibration API) — `navigator.vibrate(10)`, feature-detected (Android Chrome only; iOS Safari no have Vibration API, quiet no-op)
- [x] Status bar look (dark/light) — `apple-mobile-web-app-status-bar-style` + `theme-color` meta (light/dark by `prefers-color-scheme`)
- [x] Bottom sheet for results (swipe-to-dismiss) — drag handle: >40px drag collapse/expand, <10px = tap-toggle, 10-40px = no-op (stop jitter misfire, caught + fixed by cavecrew-reviewer)
- [x] Big touch targets (min 44x44pt) — base `button` rule, `min-height: 44px`

### 1.2 Layout Refactor
- [ ] Full-screen map as main view (mobile-first)
- [ ] Search on top as bottom sheet (not side panel)
- [ ] Search input with iOS-style search bar
- [ ] Results list feel native (sticky headers)
- [ ] Floating action buttons for actions

### 1.3 Responsive Design
- [ ] Mobile (375px): Full-screen map + bottom sheet
- [ ] Tablet (768px): Split view (map left, list right)
- [ ] Desktop: Current two-column layout
- [ ] Touch-friendly spacing everywhere

### 1.4 Accessibility & Data UX
- [x] No toggle — main results list always filtered to `accessibility === 'known-accessible'`. Two stages happen: sort-only → real filter behind checkbox → checkbox all gone, user say so ("non-accessible i dont want on the app at all"). Never bring back toggle or unknown-status escape hatch.
- [x] Always-there "you are here" map marker (not same as short-lived GPS accuracy circle)
- [ ] Mode-of-transport marker difference (bus/tram/metro/rail/ferry) — pushed off, see Backlog
- [x] OSM Notes accessibility crowdsource report link

### 1.5 Address-First Input (binding requirement, done)
- [x] Killed all lat/lon number inputs from UI — address search only (Photon/Komoot geocoding, keyless, CORS-open)
- [x] "From" field with autocomplete, default to GPS or last-used address
- [x] "To" (destination) field, optional, autocomplete too
- [x] GPS button still there, write into From field as "Current location" not raw numbers

---

## Phase 2: Real GPS Integration (Day 2)

### 2.1 Geolocation API
- [ ] Ask user permission (prompt → sticky)
- [ ] Get position (latitude, longitude, accuracy)
- [ ] Watch position updates (live track)
- [ ] Handle errors (permission denied, timeout, unavailable)
- [ ] Show user spot on map (blue dot)

### 2.2 Auto-Populate Origin
- [ ] On app load: Ask for location
- [x] GPS win sets `window.origin` + names From field "Current location" (no raw lat/lon show, must-do)
- [x] Auto-search when location granted (no button click)
- [ ] Show "Locating..." state while fetch

### 2.3 Location Display
- [ ] Accuracy circle on map
- [ ] "You are here" mark
- [ ] Move map center to user
- [ ] Recenter-on-user option (floating button)

---

## Phase 3: Real Lisbon Transit Data (Day 3)

### 3.1 Real Stop Data Integration ✅ DONE
- [x] Fetch live stops from Carris Metropolitana API (`https://api.carrismetropolitana.pt/v2/stops`, keyless, CORS-open, 12,752 stops)
- [x] Swap `mockStops` array for live fetch — no static GTFS parse needed
- [x] Honest-uncertainty model: `accessibility: 'known-accessible' | 'unknown'` (no made-up `stepFree` boolean)
- [x] Killed `findNearestStepFreeStops()` — live data + `accessibility` field beat it

### 3.2 Stop Rendering
- [ ] Color code: known-accessible vs unknown (no fake "not accessible" claims)
- [ ] Show stop name + line numbers on tap
- [ ] Distance to stop (from user GPS)
- [ ] Directions link (Apple Maps, Google Maps)

### 3.3 Accessible Route Finding — DONE (binding user spec, shipped 2026-09-01)
- [x] Nearest sure-accessible stop to origin (`nearestAccessibleStop()` in app.js, no distance cap on purpose)
- [x] Nearest sure-accessible stop to destination (same function)
- [x] "Get directions on Google Maps" button — plain outbound deep link, `target="_blank"`, no API key, no embed. Use undocumented path-based URL shape (`google.com/maps/dir/<lat1>,<lon1>/<lat2>,<lon2>/data=!3m1!4b1!4m4!4m3!2m1!4e4!3e3`) that force-picks "Wheelchair accessible" transit routing — dug out from user-captured before/after URLs (2026-09-01), no public API param exist for this. User own design, approved and built as-is — beats OTP2-self-host idea below as v1 way.
- [ ] Walking route to stop
- [ ] Bus line info + schedule
- [ ] Accessibility details (elevators, ramps, etc.)
- [ ] Full in-app journey planning (turn-by-turn, multi-leg) — still need self-host OpenTripPlanner 2 or like; out of scope for v1, Google Maps handoff cover real routing need.

---

## Phase 4: Performance & Polish (Day 4)

### 4.1 Performance
- [ ] Lazy load map tiles
- [ ] Cache GTFS data (service worker)
- [ ] Shrink JS/CSS bundle
- [ ] Tune for slow networks (3G)

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

## Phase 5: Competitive Expansion (post-launch)

Full detail moved to GitHub issues (research writeups were bloating this file):

- [Phase 5.1: Willeasy partnership](https://github.com/devotedpronet-cyber/transit-accessibility/issues/2) — blocked on partnership ask
- [Phase 5.2: OSM/GTFS cross-validation](https://github.com/devotedpronet-cyber/transit-accessibility/issues/3) — 161 stops confirmed, gap left documented
- [Phase 5.3: Live elevator status](https://github.com/devotedpronet-cyber/transit-accessibility/issues/4) — blocked on Firebase account access
- [Phase 5.4: Outage-aware trip warnings](https://github.com/devotedpronet-cyber/transit-accessibility/issues/5) — depends on 5.3
- [Phase 5.5: Last-mile sidewalk/curb-cut routing](https://github.com/devotedpronet-cyber/transit-accessibility/issues/6) — biggest lift, own phase

---

## Success Criteria

### Phase 1 ✓
- [ ] iOS-look UI on iPhone 12/13/14
- [ ] Bottom sheet for search results
- [ ] Responsive layout (mobile → desktop)
- [ ] No sideways scroll

### Phase 2 ✓
- [ ] GPS permission prompt work
- [ ] User location show on map
- [ ] Auto-search when location granted
- [ ] Error handling (no GPS, denied permission)

### Phase 3 ✓
- [ ] Real GTFS data load (~300+ stops)
- [ ] Wheelchair-accessible stops filter work
- [ ] Distance from user → stops
- [ ] Tap stop → show name + line info

### Phase 4 ✓
- [ ] App load <2s on 4G
- [ ] Work offline (cached)
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
| GPS permission denied | Show manual entry; remember user prefs |
| GTFS data stale | Fetch latest on load; cache with TTL |
| Big dataset (300+ stops) | Lazy load markers; cluster on zoom out |
| iOS notch block UI | Safe area CSS env vars; test on device |
| Slow network | Progressive enhancement; cache-first SW |

---

## Rejected / Out of Scope

**Google Maps Platform API integration (Directions/Geocoding APIs, embedded)** — still rejected.
- Cost risk: free tier cap low as 1,000–10,000 calls/mo by SKU; real overage price past that.
- API key exposure on static GitHub Pages site cannot be fixed (no backend to guard it).
- Google ToS forbid mixing Directions/Geocoding content with non-Google basemap — would force dropping Leaflet/OSM whole.

**What IS shipped instead**: plain outbound link to `google.com/maps/dir/...` that open Google Maps in new tab. No API key, nothing embedded in Leaflet map, so none of three objections apply. User own design (2026-09-01) — see Phase 3.3.

## Backlog & Moonshots

Moved to GitHub issues:

- [Backlog: mode markers, full metro roster, ferry confirmation](https://github.com/devotedpronet-cyber/transit-accessibility/issues/7)
- [Moonshots: unscoped expansion ideas](https://github.com/devotedpronet-cyber/transit-accessibility/issues/8)

Architecture note (kept — binding): Firebase (Functions/Firestore) confirmed viable as backend; not stuck with static GH Pages deploy for Phase 5+ features.

### Requested 2026-09-01 batch — done

All 6 items shipped. Full record: [changelog issue #9](https://github.com/devotedpronet-cyber/transit-accessibility/issues/9) (closed).

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

**Total: ~26 hours** (doable in 3–4 days with focus)

---

## Ready for Sonnet Review

Send to Sonnet agent:
- Check priorities (Phase 1 → Phase 2 → Phase 3 → Phase 4)
- Suggest iOS-specific UX wins
- Flag technical risks
- Say quick wins vs. deep dives
- Timeline feasibility