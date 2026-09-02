# Expansion Roadmap: Competitive Positioning & Feature Candidates

Research pass (2026-09-02) into what would make this genuinely better than Google Maps / Citymapper / Moovit for wheelchair users, and what adjacent apps (AccessMap, Wheelmap, Jaccede) got right or wrong. Feeds candidate additions into the backlog in `WORK_PLAN_MOBILE.md`. Nothing here is committed — for review before promoting into the working backlog.

Architecture note: app currently deploys static (GH Pages), but a backend is not off the table — Firebase (Functions/Firestore) is a viable host for anything below that needs server-side aggregation or scheduled polling.

## The core gap across every competitor

Google Maps, Citymapper, and Moovit all treat accessibility as a **static metadata layer** on top of a normal routing engine (station flagged "accessible" + occasional outage alert). None of them continuously verify ground truth. The two failure modes riders report over and over:

1. **Elevator/escalator outages not reflected in real time** — app says "accessible route," rider arrives at a broken lift. Biggest single pain point found across advocacy sources (CBC, UW research, DisabilityWorld) — stations often have only one elevator, so one outage removes all accessible egress.
2. **Mid-route / last-mile accessibility unmodeled** — station-to-station may be fine, but the sidewalk/curb-cut segment connecting stop to destination is invisible to all three apps. AccessMap is the only competitor that models this, via slope + curb-ramp graph routing (OpenSidewalks/`kerb=*`/`incline=*` OSM tags).

This app's existing "no fabricated accessibility, `known-accessible` vs `unknown` only" principle is already structurally ahead of all three — none of them admit uncertainty, they just show stale flags. That honesty is the wedge; the roadmap below is about giving it teeth (real-time data) rather than abandoning it.

## Candidate features, ranked by leverage

### 1. Live elevator/escalator status for Metro Lisboa (highest leverage)
Metro Lisboa publishes a live status page (`metrolisboa.pt/viajar/estado-das-linhas-e-elevadores`) — traffic-light per line, broken units listed by station/equipment ID — but **no documented public API**. NYC MTA and TfL both expose this as a proper feed (static equipment inventory + live outage status, keyed by equipment ID); Lisbon doesn't.
- Path: Firebase Function polls/scrapes the status page on a schedule, normalizes into Firestore, served to the app as a real API. Fragile (page-scrape, no SLA) but nobody else has this for Lisbon — direct differentiation vs Google Maps' "accessible" flag that doesn't know the lift is down today.
- Flag to user: scraping a page not designed as an API is brittle; monitor for breakage, and disclose data isn't first-party guaranteed (stays consistent with the "never fabricate" principle — show a "last checked" timestamp, don't claim certainty scraping can't back).

### 2. Willeasy integration — closes the 47-station accessibility gap
Found in research: **Willeasy**, a dedicated Metro de Lisboa accessibility data system (per 2023 Público coverage) — per-station platform/entrance/stairs/escalator/elevator/lift-chair status, plus accessibility data for ~35 hotels/80 restaurants/30 museums. Current backlog has only 15/47 accessible metro stations confirmed in `stops.js`'s `ACCESSIBLE_METRO_STATIONS` overlay — Willeasy may directly fill the other 32 with an authoritative source instead of manual confirmation.
- Action: check Willeasy for a direct API/export before doing more manual research on the remaining stations.

### 3. OSM `wheelchair=*` / GTFS Pathways as a cross-validation layer
OSM's `wheelchair=yes|limited|no` tagging (queryable via Overpass API, ODbL-licensed, free/keyless) and GTFS Pathways' `wheelchair_boarding` field are the de facto interoperable schema most competitor apps build on. Two uses:
- Cross-validate Carris's own `/v2/stops` accessibility claims against OSM/Wheelmap community data — surface disagreements rather than picking one silently.
- Fill genuine data gaps (ferry terminals, ambiguous stations) where Carris itself has no answer, keeping the `unknown` bucket smaller without fabricating certainty.
- Wheelmap also has a write API — could offer a "report here" link that writes back to OSM (similar to the existing OSM Notes crowdsourcing link already in the app, but writing structured `wheelchair=*` tags instead of a free-text note).

### 4. Last-mile sidewalk/curb-cut routing (AccessMap-style) — high value, high cost
AccessMap's core differentiator: routes wheelchair users using a slope + curb-ramp weighted graph, not street centerlines. This is the single feature category most clearly *not* covered by Google/Citymapper/Moovit and the #5 pain point found in user research (last-block impassability even when the station itself is accessible).
- No longer ruled out by "no backend" — Firebase Functions can run a small routing service.
- Realistic path: build-time or scheduled Firebase Function pulls OSM sidewalk/crossing/curb data (Overpass API, `OpenSidewalks` tag schema) for a radius around each Lisbon GTFS stop, precomputes a small pedestrian graph per stop-cluster, stores in Firestore. Client does short A*/`ngraph.path` search over the small local graph for "last mile from stop to destination" — avoids needing a full city-scale OSRM/pgRouting deployment.
- Scope this as its own phase; it's the biggest lift on this list but also the clearest "we do something Google Maps structurally can't" claim.

### 5. Elevator-outage-aware trip warnings, not just station flags
Once #1 exists: instead of a binary accessible/not flag, surface "accessible route exists, but the elevator at [station] has been down since [time]" inline in results — turns competitors' generic accessible-flag failure mode into this app's headline honesty feature.

### 6. Paratransit/assistance-booking friction (lower priority, out of current scope)
Research surfaced booking-friction and rigid-notice-window complaints for paratransit services (Wheel-Trans, DART-type services) — real pain point but a different product (booking system vs journey planner). Note for future consideration, not actionable now given current scope (Lisbon public transit, not paratransit).

## Moonshots (unconstrained — no feasibility filter applied)
Per explicit direction: this section is creative exploration, not scoped against current architecture/effort. Feasibility triage is a deliberate later step, not baked in here.

- **Crowd-verified elevator status, live** — instead of (or alongside) scraping Metro Lisboa's page: a "tap to confirm this elevator is working" button at the point of use (QR code at the elevator, or geofenced prompt), turning every rider into a live sensor. Outpaces official feeds that update on their own schedule.
- **Predictive accessibility** — model outage patterns (which elevators fail most, time-of-day/day-of-week risk) from historical status data, and warn *before* a trip: "this elevator fails ~2x/week, consider the alternate route." No competitor does prediction, only current-state.
- **Accessible-route social proof** — "12 wheelchair users completed this exact route this week" style confidence signal, borrowing from Waze's crowd-density model but for accessibility confidence instead of traffic.
- **Companion mode / buddy matching** — opt-in matching of wheelchair users traveling similar routes at similar times, for mutual assistance or just company — addresses the "fear of being stranded alone" pain point directly, not just informationally.
- **City accountability dashboard** — public, aggregate view of which stations/elevators fail most often, turned into a shareable civic-pressure tool (mirrors the Civic Code contest's own framing — accessibility data as public accountability, not just a trip planner feature).
- **Voice-first / hands-free mode** — full voice interaction for the segment of wheelchair users who also have limited hand mobility; goes beyond visual UI entirely rather than adding an accessibility layer on top of one.
- **"Accessible day" trip chaining** — plan a whole day (multiple stops: pharmacy, park, café) verifying accessibility end-to-end across the full chain, not just point-to-point — no competitor treats multi-stop itineraries as a first-class accessibility problem.
- **Physical world integration** — partner with the city to place QR codes at elevators/ramps linking straight into the app's live status + report flow, closing the loop between physical infrastructure and the data describing it.
- **Open accessibility data as the product, not just the app** — publish the aggregated/cross-validated accessibility dataset (Carris + OSM + Willeasy + live status) as an open API other Lisbon apps/researchers can build on — positions this project as infrastructure, not just one more app competing with Google Maps.

## Explicitly rejected / already covered
- Full turn-by-turn in-app navigation — still out of scope (Google Maps deep-link handoff covers it); this roadmap doesn't reopen that decision.
- Mode-of-transport marker icons — already in backlog (`WORK_PLAN_MOBILE.md`), unaffected by this research; still blocked on real per-mode feed data (heuristic substring matching was tried and rejected for false positives — OSM/GTFS route_type field may be a cleaner source, worth revisiting alongside #3).

## Sources
Research swarm findings (6 agents, 2026-09-02): AccessMap/Wheelmap/Jaccede competitor scan; Google Maps/Citymapper/Moovit accessibility-specific gap analysis; wheelchair-user pain-point survey (CBC, UW UnlockedMaps, DisabilityWorld, advocacy orgs); accessibility data sources (OSM wheelchair tagging, Wheelmap API, GTFS Pathways, Lisboa Aberta, Willeasy); elevator/escalator outage feed patterns (MTA Datamine, TfL API, Metro Lisboa status page); sidewalk/curb-cut routing feasibility (AccessMap/OpenSidewalks architecture). Full source links available in session transcript on request.
