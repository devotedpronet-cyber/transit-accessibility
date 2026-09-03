# Expansion Roadmap: Competitive Positioning & Feature Candidates

Research pass (2026-09-02): what make app better than Google Maps / Citymapper / Moovit for wheelchair user, and what nearby app (AccessMap, Wheelmap, Jaccede) do good or bad. Feed candidate into backlog in `WORK_PLAN_MOBILE.md`. Nothing committed — review first before put in real backlog.

Architecture note: app deploy static now (GH Pages), but backend still possible — Firebase (Functions/Firestore) work fine for anything below that need server-side aggregation or scheduled polling.

## The core gap across every competitor

Google Maps, Citymapper, Moovit all treat accessibility as **static metadata layer** on top of normal routing engine (station flagged "accessible" + sometimes outage alert). None check ground truth all time. Two failure mode rider say again and again:

1. **Elevator/escalator outages not reflected in real time** — app say "accessible route," rider come, lift broken. Biggest pain point in advocacy sources (CBC, UW research, DisabilityWorld) — station often have only one elevator, so one outage kill all accessible way out.
2. **Mid-route / last-mile accessibility unmodeled** — station-to-station fine, but sidewalk/curb-cut piece from stop to destination invisible to all three app. AccessMap only competitor that model this, via slope + curb-ramp graph routing (OpenSidewalks/`kerb=*`/`incline=*` OSM tags).

App principle "no fabricated accessibility, `known-accessible` vs `unknown` only" already ahead of all three — they never admit doubt, just show stale flag. Honesty is the wedge; roadmap below give it teeth (real-time data), not throw it away.

## Candidate features, ranked by leverage

### 1. Live elevator/escalator status for Metro Lisboa (highest leverage)
Metro Lisboa publish live status page (`metrolisboa.pt/viajar/estado-das-linhas-e-elevadores`) — traffic-light per line, broken unit listed by station/equipment ID — but **no documented public API**. NYC MTA and TfL both give proper feed (static equipment inventory + live outage status, keyed by equipment ID); Lisbon no.
- Path: Firebase Function poll/scrape status page on schedule, normalize into Firestore, serve to app as real API. Fragile (page-scrape, no SLA) but nobody else have this for Lisbon — direct differentiation vs Google Maps "accessible" flag that not know lift down today.
- Flag to user: scrape page not made as API = brittle; watch for breakage, and say data not first-party guaranteed (stay consistent with "never fabricate" principle — show "last checked" timestamp, not claim certainty scrape cannot back).

### 2. Willeasy integration — closes the 47-station accessibility gap
Research find **Willeasy**, dedicated Metro de Lisboa accessibility data system (per 2023 Público coverage) — per-station platform/entrance/stairs/escalator/elevator/lift-chair status, plus accessibility data for ~35 hotels/80 restaurants/30 museums. Backlog now have only 15/47 accessible metro station confirmed in `stops.js` `ACCESSIBLE_METRO_STATIONS` overlay — Willeasy maybe fill other 32 with authoritative source instead of manual confirm.
- Action: check Willeasy for direct API/export before do more manual research on remaining station.

### 3. OSM `wheelchair=*` / GTFS Pathways as a cross-validation layer
OSM `wheelchair=yes|limited|no` tagging (query via Overpass API, ODbL-licensed, free/keyless) and GTFS Pathways `wheelchair_boarding` field are de facto shared schema most competitor app build on. Two use:
- Cross-validate Carris own `/v2/stops` accessibility claim against OSM/Wheelmap community data — show disagreement, not pick one silently.
- Fill real data gap (ferry terminal, unclear station) where Carris have no answer, keep `unknown` bucket smaller without faking certainty.
- Wheelmap also have write API — could offer "report here" link that write back to OSM (like existing OSM Notes crowdsourcing link in app, but write structured `wheelchair=*` tags instead of free-text note).

### 4. Last-mile sidewalk/curb-cut routing (AccessMap-style) — high value, high cost
AccessMap core differentiator: route wheelchair user with slope + curb-ramp weighted graph, not street centerline. This is feature category most clearly *not* covered by Google/Citymapper/Moovit and #5 pain point in user research (last-block impassable even when station itself accessible).
- No longer blocked by "no backend" — Firebase Functions can run small routing service.
- Realistic path: build-time or scheduled Firebase Function pull OSM sidewalk/crossing/curb data (Overpass API, `OpenSidewalks` tag schema) for radius around each Lisbon GTFS stop, precompute small pedestrian graph per stop-cluster, store in Firestore. Client do short A*/`ngraph.path` search over small local graph for "last mile from stop to destination" — no need full city-scale OSRM/pgRouting deploy.
- Make own phase; biggest lift on list but also clearest "we do thing Google Maps structurally cannot" claim.

### 5. Elevator-outage-aware trip warnings, not just station flags
After #1 exist: instead of binary accessible/not flag, show "accessible route exists, but elevator at [station] down since [time]" inline in results — turn competitor generic accessible-flag failure into app headline honesty feature.

### 6. Paratransit/assistance-booking friction (lower priority, out of current scope)
Research find booking-friction and rigid-notice-window complaint for paratransit service (Wheel-Trans, DART-type). Real pain point but different product (booking system, not journey planner). Note for future, not actionable now given scope (Lisbon public transit, not paratransit).

## Moonshots (unconstrained — no feasibility filter applied)
Per direction: this section is creative exploration, not scoped against current architecture/effort. Feasibility triage come later on purpose, not baked in here.

- **Crowd-verified elevator status, live** — instead of (or beside) scraping Metro Lisboa page: "tap to confirm this elevator working" button at point of use (QR code at elevator, or geofenced prompt), make every rider a live sensor. Beat official feed that update on own schedule.
- **Predictive accessibility** — model outage pattern (which elevator fail most, time-of-day/day-of-week risk) from historical status data, warn *before* trip: "this elevator fail ~2x/week, consider alternate route." No competitor do prediction, only current-state.
- **Accessible-route social proof** — "12 wheelchair users completed this exact route this week" confidence signal, like Waze crowd-density model but for accessibility confidence, not traffic.
- **Companion mode / buddy matching** — opt-in matching of wheelchair user traveling similar route at similar time, for mutual help or just company — hit "fear of being stranded alone" pain point directly, not just with information.
- **City accountability dashboard** — public aggregate view of which station/elevator fail most, turned into shareable civic-pressure tool (mirror Civic Code contest framing — accessibility data as public accountability, not just trip planner feature).
- **Voice-first / hands-free mode** — full voice interaction for wheelchair user who also have limited hand mobility; go past visual UI entirely, not add accessibility layer on top of one.
- **"Accessible day" trip chaining** — plan whole day (many stops: pharmacy, park, café) verify accessibility end-to-end across full chain, not just point-to-point — no competitor treat multi-stop itinerary as first-class accessibility problem.
- **Physical world integration** — partner with city to put QR codes at elevator/ramp linking straight into app live status + report flow, close loop between physical infrastructure and data describing it.
- **Open accessibility data as the product, not just the app** — publish aggregated/cross-validated accessibility dataset (Carris + OSM + Willeasy + live status) as open API other Lisbon app/researcher can build on — make project infrastructure, not one more app fighting Google Maps.

## Explicitly rejected / already covered
- Full turn-by-turn in-app navigation — still out of scope (Google Maps deep-link handoff cover it); roadmap not reopen that decision.
- Mode-of-transport marker icons — already in backlog (`WORK_PLAN_MOBILE.md`), untouched by this research; still blocked on real per-mode feed data (heuristic substring matching tried and rejected for false positive — OSM/GTFS route_type field maybe cleaner source, worth revisit with #3).

## Sources
Research swarm findings (6 agents, 2026-09-02): AccessMap/Wheelmap/Jaccede competitor scan; Google Maps/Citymapper/Moovit accessibility-specific gap analysis; wheelchair-user pain-point survey (CBC, UW UnlockedMaps, DisabilityWorld, advocacy orgs); accessibility data sources (OSM wheelchair tagging, Wheelmap API, GTFS Pathways, Lisboa Aberta, Willeasy); elevator/escalator outage feed patterns (MTA Datamine, TfL API, Metro Lisboa status page); sidewalk/curb-cut routing feasibility (AccessMap/OpenSidewalks architecture). Full source link in session transcript on request.