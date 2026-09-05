# Backlog

Open work on the Lisbon Transit Accessibility Planner. Each item links to its tracking issue — check the issue for full context before starting. Contributions welcome; see [CONTRIBUTING.md](CONTRIBUTING.md).

## 🙋 Help wanted: backend

The app is currently a static frontend (GH Pages) plus Firestore and a free GitHub Actions poller — no paid Cloud Functions yet. That's the ceiling blocking Phase 5.5 below, which needs a small routing service for sidewalk/curb-cut pathfinding. If you can build Firebase Functions / Cloud Run pieces, or help cover Blaze-tier cost if usage grows, this is the single highest-leverage way to unstick the project. Open an issue or comment on #6 to pick this up.

## Phase 5 — data & routing

- [ ] **Phase 5.1: Willeasy accessible-metro data partnership** ([#2](https://github.com/devotedpronet-cyber/transit-accessibility/issues/2)) — no public API/export exists (CC BY-ND license blocks scraping/reformatting anyway); needs a direct partnership ask to `info@willeasy.net`.
- [ ] **Phase 5.2: OSM/GTFS accessibility cross-validation** ([#3](https://github.com/devotedpronet-cyber/transit-accessibility/issues/3)) — 161/12,752 stops cross-confirmed so far via geo-fuzzy match; 116 unmatched OSM nodes and 26 metro stations still open.
- [x] **Phase 5.3: Live elevator/escalator status backend** — shipped (GitHub Actions poller, see commit history).
- [x] **Phase 5.4: Outage-aware trip warnings** — shipped (live Firestore elevator-status reads wired into `app.js`/`map.js`, see commit history).
- [ ] **Phase 5.5: Last-mile sidewalk/curb-cut routing** ([#6](https://github.com/devotedpronet-cyber/transit-accessibility/issues/6)) — biggest lift, its own phase; prototype OpenSidewalks + `ngraph.path` A* over one pilot stop cluster first.

## Persistent backlog

([#7](https://github.com/devotedpronet-cyber/transit-accessibility/issues/7))

- [ ] Mode-of-transport marker difference (bus/tram/metro/rail/ferry) — needs real per-mode feed data or an explicit `mode` field; a substring name-heuristic was tried and rejected (false positives), don't repeat that approach.
- [ ] Full official roster of all 47 accessible Metro stations — 21/47 confirmed by name so far in `stops.js`'s `ACCESSIBLE_METRO_STATIONS`.
- [ ] Pedrouços/Algés ferry terminal accessibility — unconfirmed, kept out of the overlay until real data exists.

## Moonshots (untriaged)

([#8](https://github.com/devotedpronet-cyber/transit-accessibility/issues/8), full writeup in `docs/EXPANSION_ROADMAP.md`)

- [ ] Crowd-verified elevator status (QR/geofenced "tap to confirm")
- [ ] Predictive accessibility (model likely elevator failures)
- [ ] Accessible-route social proof ("N wheelchair users completed this route this week")
- [ ] Companion/buddy matching for riders
- [ ] City accountability dashboard (public aggregate of failing stations/elevators)
- [ ] Voice-first/hands-free mode
- [ ] "Accessible day" multi-stop itinerary chaining
- [ ] Physical-world QR code integration at elevators/ramps
- [ ] Open accessibility data as a public API (Carris + OSM + Willeasy + live status)

---

This project started as a Civic Code contest entry and is now open for anyone who wants to help close the accessibility-data gap for Lisbon transit — pick an item, open a PR, or file a new issue.
