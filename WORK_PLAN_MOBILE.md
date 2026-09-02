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

## Phase 5: Competitive Expansion (post-launch)

Sequences the 5 ranked candidates from the backlog above. Moonshots stay unscheduled — not triaged for feasibility yet. Each subsection: goal + concrete first step; full task breakdown happens when the phase is actually started, per existing convention.

### 5.1 Willeasy Integration
Goal: close the 47-station accessible-metro gap (currently 15/47 confirmed) with an authoritative source instead of manual confirmation.
- [x] First step: evaluated Willeasy (willeasy.net) for a direct data export/API — **not usable off-the-shelf**. Run by Willeasy S.r.l. (Italy), consumer-facing map/search + crowdsourcing app only, no public API/dataset/export found anywhere on site or in press coverage. Content licensed CC BY-ND 4.0 (attribution + **no derivatives** — blocks reformatting into our own DB even if data were obtained). Station coverage vs. our 47 unconfirmed. Verdict: **(b) needs partnership** — closing this gap requires directly emailing `info@willeasy.net` to negotiate data access/an ND-license exception, not a self-serve integration. (Investigated 2026-09-02.)
- [ ] Next step: send partnership inquiry to Willeasy, or fall back to 5.2 (OSM/GTFS Pathways) as the actual near-term path to shrink the accessibility gap while a Willeasy response (if any) is pending.

### 5.2 OSM / GTFS Pathways Cross-Validation
Goal: shrink the `unknown` bucket and cross-check Carris's own accessibility claims, without backend cost (reads only).
- [ ] First step: prototype an Overpass API query for `wheelchair=*` tags against the current stop set, diff against `stops.js` accessibility values.

### 5.3 Live Elevator/Escalator Status (first Firebase-backed feature)
Goal: real-time Metro Lisboa elevator status where none exists as a public API today.
- [ ] First step: stand up a scheduled Firebase Function that polls `metrolisboa.pt/viajar/estado-das-linhas-e-elevadores` and writes normalized status to Firestore, with a "last checked" timestamp surfaced alongside any value shown in-app.

### 5.4 Outage-Aware Trip Warnings
Goal: turn a binary accessible/not flag into "accessible route exists, but the lift at [station] has been down since [time]."
- [ ] First step (depends on 5.3 shipping): wire the Firestore elevator-status read into the existing results-rendering path in `app.js`/`map.js`.

### 5.5 Last-Mile Sidewalk/Curb-Cut Routing
Goal: the one accessibility capability none of Google Maps, Citymapper, or Moovit have. Largest lift — own phase, benefits from 5.2's OSM data but doesn't depend on it.
- [ ] First step: pull OpenSidewalks-tagged sidewalk/crossing/curb data for a small radius around one pilot stop cluster via Overpass, precompute a local pedestrian graph, prototype client-side A* (`ngraph.path`) over it before deciding whether to scale city-wide.

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

### Ranked candidates (expansion research, 2026-09-02)

Full writeup + sources: `docs/EXPANSION_ROADMAP.md`. Architecture note: Firebase (Functions/Firestore) is confirmed viable as a backend — not limited to the current static GH Pages deployment for these.

- Live elevator/escalator status for Metro Lisboa — Metro Lisboa runs a status page (`metrolisboa.pt/viajar/estado-das-linhas-e-elevadores`) with no public API. Scheduled Firebase Function scrapes/normalizes into Firestore, served as a real endpoint. Show "last checked" timestamp — scraping can't back the same certainty an API would.
- Willeasy integration — Metro de Lisboa's own per-station accessibility system (platform/entrance/stairs/escalator/elevator/lift-chair), per 2023 Público coverage. Check for a direct export/API before doing more manual station-by-station confirmation — likely closes the 47-station gap above directly.
- OSM `wheelchair=*` / GTFS Pathways cross-validation — Overpass API (free, ODbL), cross-check Carris's own accessibility claims and fill genuine `unknown` gaps (ferry terminals, ambiguous stations) without fabricating certainty. Wheelmap write API could extend the existing OSM Notes crowdsourcing link into structured tag writes.
- Last-mile sidewalk/curb-cut routing (AccessMap-style) — the one capability none of Google Maps/Citymapper/Moovit have. Pull OSM sidewalk/crossing/curb data (OpenSidewalks tag schema) per stop-cluster via Firebase Function, precompute a small local pedestrian graph, client-side A*/`ngraph.path` for the final leg. Largest lift on this list — own phase.
- Outage-aware trip warnings — depends on the elevator-status item above. Surface inline in results: "accessible route exists, but the lift at [station] has been down since [time]" instead of a binary flag.

### Moonshots (unscoped, 2026-09-02 — not triaged for feasibility)

Creative pass, deliberately unfiltered by current effort/architecture per explicit direction. Full writeup: `docs/EXPANSION_ROADMAP.md`.

- Crowd-verified elevator status — QR code or geofenced "tap to confirm this is working" at the elevator, faster than any official feed's update cycle.
- Predictive accessibility — model which elevators fail most (time-of-day/day-of-week) from historical status data, warn before the trip.
- Accessible-route social proof — "12 wheelchair users completed this route this week," Waze-style crowd-density model for accessibility confidence instead of traffic.
- Companion/buddy matching — opt-in matching of riders on similar routes/times, addresses "fear of being stranded alone" directly.
- City accountability dashboard — public aggregate view of which stations/elevators fail most, a civic-pressure tool (matches the Civic Code contest's own framing).
- Voice-first/hands-free mode — full voice interaction for riders with limited hand mobility, not a layer bolted onto a visual UI.
- "Accessible day" trip chaining — verify a whole multi-stop itinerary (pharmacy → park → café) end-to-end, not just point-to-point.
- Physical world integration — QR codes at elevators/ramps (placed by the city) linking into the app's live status + report flow.
- Open accessibility data as the product — publish the cross-validated dataset (Carris + OSM + Willeasy + live status) as an open API for other Lisbon apps/researchers.

### Requested 2026-09-01 (in progress, this batch)

1. [x] iOS UI/UX design pass on items 2-4 below, via context7 (Apple HIG / iOS patterns) before building.
2. [x] Route section ("Route via accessible stops") must render directly under the Search/GPS button group, not below the note/results list. — commit c1548e3
3. [x] Kill the "accessible stops near me" results list. Superseded by turning the "From" field into a dropdown: nearest accessible stops sorted by distance, distance shown per stop, picking one sets it as origin. — built, under review before commit
4. [x] Bug: the "you are here" map marker and where the map recenters after tapping the GPS button don't match — same coordinate should drive both. — commit 8434bea (`setViewAboveSheet` helper). Also build: tap-and-drag the map to choose the starting location (pin-follows-map-center pattern) — commit 8483d59, reviewed + 2 bugs fixed pre-ship (race condition + closure-scoping in cancel).
5. [x] `/v2/lines` join — stops now show real rider-facing line numbers (`stop.lines`) instead of empty field. Joins `stop.line_ids` against `/v2/lines[].short_name`. — commit 812f0d2, `stops.js`.
6. [x] External PR #1 (stale, 15 commits behind main, touched dead `gtfs.js`/`mockStops` code that no longer exists) — closed, not merged. 5 still-valid a11y/security findings re-verified against current `main` and fixed directly instead: viewport `user-scalable=no` removed (WCAG 1.4.4), SRI hashes added to both Leaflet CDN tags, page heading promoted h2→h1, `<label for>` association fixed on From/To inputs, `aria-live="polite" role="status"` added to 3 dynamic result containers. Verified in live browser (labels/status roles/heading all confirmed via JS `.labels` + accessibility tree, no console errors, 21/21 tests still pass). — commit 68ee7b4.

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
