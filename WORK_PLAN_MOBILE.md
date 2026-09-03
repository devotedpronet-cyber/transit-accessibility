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

Puts the 5 ranked candidates from backlog above in order. Moonshots stay unscheduled — no feasibility triage yet. Each subsection: goal + first concrete step; full task breakdown come when phase really start, like usual.

### 5.1 Willeasy Integration
Goal: close 47-station accessible-metro gap (now 15/47 confirmed) with real source, not hand confirmation.
- [x] First step: checked Willeasy (willeasy.net) for direct data export/API — **not usable off-the-shelf**. Run by Willeasy S.r.l. (Italy), consumer map/search + crowdsource app only, no public API/dataset/export anywhere on site or in press. Content licensed CC BY-ND 4.0 (attribution + **no derivatives** — block reformat into our own DB even if we got data). Station coverage vs. our 47 unconfirmed. Verdict: **(b) needs partnership** — closing gap need direct email to `info@willeasy.net` to talk data access/ND-license exception, not self-serve integration. (Investigated 2026-09-02.)
- [ ] Next step: send partnership ask to Willeasy, or fall back to 5.2 (OSM/GTFS Pathways) as the real near-term path to shrink gap while waiting on Willeasy answer (if any).

### 5.2 OSM / GTFS Pathways Cross-Validation
Goal: shrink `unknown` bucket and cross-check Carris own accessibility claims, no backend cost (reads only).
- [x] First step: prototyped Overpass API query (`node["station"="subway"]` in Lisbon bbox, 46 stations found) and diffed `wheelchair=*` tags against `stops.js`'s `ACCESSIBLE_METRO_STATIONS`. Results: OSM say 11 stations `wheelchair=yes`, 5 `limited`, 4 `no`, 26 untagged. **6 new-confirmed stations not in our list** (Aeroporto, Ameixoeira, Chelas, Odivelas, Restauradores, Santa Apolónia) — added to `stops.js`, confirmed total now 21/47. **2 fights found**: OSM say `wheelchair=no` for Colégio Militar/Luz and Campo Pequeno, but Metro de Lisboa own 2026-07-27 announcement list both accessible — kept as known-accessible (primary source beat crowdsourced tag) but flagged in `stops.js` comment for re-check if rider report problem, per "surface disagreements, don't silently pick one" design in `docs/EXPANSION_ROADMAP.md`. Wider bus/tram stop-level Overpass query (non-metro) gave 2,453 wheelchair-tagged elements Lisbon-wide but nearly all `platform`/`stop_position` nodes, not matchable to Carris stop IDs without name/geo-fuzzy-match layer. (Investigated 2026-09-02.)
- [x] Next step: built the geo-fuzzy-match layer — queried OSM city-wide (bbox over full Carris Metropolitana area) for `wheelchair=*` on `bus_stop`/`platform`/`tram_stop` nodes (247 found), matched each `wheelchair=yes` node to nearest Carris stop by haversine distance (≤20m), deduped by Carris stop ID. Result: **131 Carris stop IDs cross-confirmed accessible** — real signal, since Carris own feed ship `wheelchair_boarding=false` (no info) on all 12,752 stops. Wired into `stops.js` as `OSM_CONFIRMED_STOP_IDS`, applied at fetch time next to existing Carris/metro/ferry logic. With 5.2 metro adds, confirmed-accessible stop count go from 15+9=24 to 21+9+131=161. In-app disclosure note updated in all 7 languages. (Investigated + shipped 2026-09-02.)
- [ ] Gap left: 116 of the 247 OSM-tagged nodes no match inside 20m (name variants, stops OSM track that Carris don't, or >20m drift) — looser match (wider radius + name similarity) could grab more but risk false positives; not worth it without spot-check pass. Metro stations still unmatched (26) and full city coverage still need Willeasy partnership (5.1) or more OSM tagging.

### 5.3 Live Elevator/Escalator Status (first Firebase-backed feature)
Goal: real-time Metro Lisboa elevator status where no public API exist today.
- [x] First step: the public status *page* itself (`metrolisboa.pt/viajar/estado-das-linhas-e-elevadores`) is static WordPress post (`article:modified_time` over a month stale) — scraping it would NOT be live. Found real source instead: page own JS call undocumented WordPress AJAX endpoint, `GET https://www.metrolisboa.pt/wp-admin/admin-ajax.php?action=estado_linha_ajax_2022_nova_action` — no key, no auth, return live HTML fragment with real per-elevator status: line → station → `{Equipamento, Nº, Localização (which platform/direction), Estado: "Operacional" | "Fora de serviço"}`, plus per-line summary (e.g. "4/42 (9,52%) elevadores desta linha estão fora de serviço"). Confirmed real-time: spot-check show live single outages (e.g. Campo Pequeno elevator 1 "Fora de serviço" while elevators 2-3 same station "Operacional" — exactly the per-equipment grain 5.4 need). (Investigated 2026-09-02.)
- [ ] Next step (need Firebase project — blocked on account access, not technical dead end): stand up scheduled Firebase Function that poll this endpoint, parse the HTML fragment (structure is regular: repeating station→equipment blocks, parseable with no headless browser), write normalized `{station, equipmentId, location, status, lastChecked}` to Firestore. Endpoint undocumented and unversioned — brittle by nature, watch for markup change; keep showing "last checked" timestamp per app never-fabricate-certainty rule.

### 5.4 Outage-Aware Trip Warnings
Goal: turn binary accessible/not flag into "accessible route exists, but the lift at [station] has been down since [time]."
- [ ] First step (need 5.3 shipped): wire Firestore elevator-status read into existing results-render path in `app.js`/`map.js`.

### 5.5 Last-Mile Sidewalk/Curb-Cut Routing
Goal: the one accessibility power none of Google Maps, Citymapper, Moovit have. Biggest lift — own phase, gains from 5.2 OSM data but no depend on it.
- [ ] First step: pull OpenSidewalks-tagged sidewalk/crossing/curb data for small radius around one pilot stop cluster via Overpass, precompute local pedestrian graph, prototype client-side A* (`ngraph.path`) over it before deciding to scale city-wide.

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

## Backlog (persistent — do not drop across sessions)

- Mode-of-transport marker difference (bus/tram/metro/rail/ferry). Some research done: ~52-name Metro station roster (Wikipedia), 9 ferry terminal names (WebSearch), CP rail roster incomplete. Substring name-heuristic was tried and clearly rejected (false positives: "...ESTACIONA" matched as parking, bus stops near train stations mislabeled as rail) — never bring that back; need real per-mode feed data or explicit `mode` field from joined source.
- Full official roster of all 47 accessible Metro stations (now only 15 of 47 confirmed by name from Metro de Lisboa own site sit in `stops.js`'s `ACCESSIBLE_METRO_STATIONS` overlay — extend if complete official list show up, e.g. from Metro de Lisboa accessibility page direct, not news articles).
- Pedrouços/Algés ferry terminal accessibility unconfirmed (out of overlay until real data).

### Ranked candidates (expansion research, 2026-09-02)

Full writeup + sources: `docs/EXPANSION_ROADMAP.md`. Architecture note: Firebase (Functions/Firestore) confirmed viable as backend — not stuck with current static GH Pages deploy for these.

- Live elevator/escalator status for Metro Lisboa — Metro Lisboa run status page (`metrolisboa.pt/viajar/estado-das-linhas-e-elevadores`) with no public API. Scheduled Firebase Function scrape/normalize into Firestore, served as real endpoint. Show "last checked" timestamp — scraping cannot back same certainty an API would.
- Willeasy integration — Metro de Lisboa own per-station accessibility system (platform/entrance/stairs/escalator/elevator/lift-chair), per 2023 Público coverage. Check for direct export/API before more hand station-by-station confirming — likely close the 47-station gap direct.
- OSM `wheelchair=*` / GTFS Pathways cross-validation — Overpass API (free, ODbL), cross-check Carris own accessibility claims and fill real `unknown` gaps (ferry terminals, murky stations) without faking certainty. Wheelmap write API could grow the existing OSM Notes crowdsource link into structured tag writes.
- Last-mile sidewalk/curb-cut routing (AccessMap-style) — the one power none of Google Maps/Citymapper/Moovit have. Pull OSM sidewalk/crossing/curb data (OpenSidewalks tag schema) per stop-cluster via Firebase Function, precompute small local pedestrian graph, client-side A*/`ngraph.path` for final leg. Biggest lift on list — own phase.
- Outage-aware trip warnings — depend on elevator-status item above. Show inline in results: "accessible route exists, but the lift at [station] has been down since [time]" not a binary flag.

### Moonshots (unscoped, 2026-09-02 — not triaged for feasibility)

Creative pass, on purpose unfiltered by current effort/architecture per direct order. Full writeup: `docs/EXPANSION_ROADMAP.md`.

- Crowd-verified elevator status — QR code or geofenced "tap to confirm this is working" at the elevator, faster than any official feed update cycle.
- Predictive accessibility — model which elevators fail most (time-of-day/day-of-week) from past status data, warn before trip.
- Accessible-route social proof — "12 wheelchair users completed this route this week," Waze-style crowd-density model for accessibility confidence not traffic.
- Companion/buddy matching — opt-in match of riders on like routes/times, hit "fear of being stranded alone" direct.
- City accountability dashboard — public aggregate view of which stations/elevators fail most, civic-pressure tool (fits Civic Code contest own framing).
- Voice-first/hands-free mode — full voice for riders with limited hand mobility, not layer bolted onto visual UI.
- "Accessible day" trip chaining — verify whole multi-stop itinerary (pharmacy → park → café) end-to-end, not just point-to-point.
- Physical world integration — QR codes at elevators/ramps (placed by city) linking into app live status + report flow.
- Open accessibility data as the product — publish the cross-validated dataset (Carris + OSM + Willeasy + live status) as open API for other Lisbon apps/researchers.

### Requested 2026-09-01 (in progress, this batch)

1. [x] iOS UI/UX design pass on items 2-4 below, via context7 (Apple HIG / iOS patterns) before building.
2. [x] Route section ("Route via accessible stops") must render right under the Search/GPS button group, not under the note/results list. — commit c1548e3
3. [x] Kill the "accessible stops near me" results list. Beaten by turning "From" field into dropdown: nearest accessible stops sorted by distance, distance shown per stop, pick one set it as origin. — built, under review before commit
4. [x] Bug: the "you are here" map marker and where map recenters after GPS button tap don't match — same coordinate should drive both. — commit 8434bea (`setViewAboveSheet` helper). Also build: tap-and-drag map to pick start location (pin-follows-map-center pattern) — commit 8483d59, reviewed + 2 bugs fixed pre-ship (race condition + closure-scoping in cancel).
5. [x] `/v2/lines` join — stops now show real rider-facing line numbers (`stop.lines`) not empty field. Join `stop.line_ids` against `/v2/lines[].short_name`. — commit 812f0d2, `stops.js`.
6. [x] External PR #1 (stale, 15 commits behind main, touched dead `gtfs.js`/`mockStops` code that no longer exist) — closed, not merged. 5 still-good a11y/security findings re-checked against current `main` and fixed direct instead: viewport `user-scalable=no` removed (WCAG 1.4.4), SRI hashes added to both Leaflet CDN tags, page heading bumped h2→h1, `<label for>` tie fixed on From/To inputs, `aria-live="polite" role="status"` added to 3 dynamic result containers. Verified in live browser (labels/status roles/heading all confirmed via JS `.labels` + accessibility tree, no console errors, 21/21 tests still pass). — commit 68ee7b4.

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