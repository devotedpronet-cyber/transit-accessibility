# WebSummit Portfolio: Transit Accessibility Planner

## Goal
Acquire WebSummit free developer ticket by demonstrating "frequent contribution to high-impact development projects."

## Strategy
- **1 strong personal project** (this repo): Lisbon transit accessibility routing
- **2–3 merged PRs in recognized OSS** (community engagement)
- **Teaching post** (dev.to): Share knowledge publicly

## Current Status (Day 1)

### ✅ Personal Project: transit-accessibility-planner
**Repo:** devotedpronet-cyber/transit-accessibility-planner

**Completed:**
- Core logic: Haversine distance calculation + accessibility filtering (100% test coverage)
- Map view: Leaflet.js integration with color-coded stop markers
- CI/CD: GitHub Actions testing + GitHub Pages deployment
- Documentation: README, architecture guide, test suite (12 tests passing)

**Commits (4):**
1. `feat: lisbon transit accessibility planner - step-free stops finder`
2. `feat: add map view with leaflet.js and mock stops`
3. `feat: integrate Leaflet.js map view and add tests`
4. `ci: add GitHub Pages deployment workflow`

**Next:**
- [ ] Real Lisbon GTFS data integration (replace mock stops)
- [ ] Deploy live demo to GitHub Pages
- [ ] Publish on ProductHunt or showcase

---

### ⏳ External PRs (In Progress)

#### PR #1: all-aboard-ohio/communication-guides (READY TO SUBMIT)
**Branch:** guide/economic-data-expand
**Contribution:** Complete "How to Discuss Economic Data" guide
- Goals, 3 key talking points, resources, example use case
- ~1,500 words of original transit advocacy content
- Transit economics framing for fiscal-conservative audiences
- **Status:** Commit ready, awaiting fork + PR submission
- **Impact:** Transit advocacy org, high visibility

#### PR #2: devpt-org/public-data-portugal (READY TO SUBMIT)
**Branch:** add/carris-lisboa
**Contribution:** Add Carris Lisboa to Portuguese open data registry
- Added Lisbon bus operator (80% of bus network) to registry
- Fills gap: Carris was missing from Transportes section
- Links to EasyGO portal + real-time data
- **Status:** Commit ready, awaiting fork + PR submission
- **Impact:** Portugal civic tech community, local Lisbon context

---

## Timeline to WebSummit

**Week 1 (Days 1–5):** External PR #1 submitted
- Parallel: Research Lisbon GTFS data
- Parallel: Write map tests (DONE)

**Week 2 (Days 6–10):** External PR #1 merges, PR #2 submitted
- Integrate real GTFS data into transit-accessibility
- Deploy live demo to GitHub Pages
- Begin teaching post draft

**Week 3 (Days 11–15):** PRs #1, #2 merged, PR #3 submitted
- Publish teaching post on dev.to
- Polish README + showcase repo
- Submit WebSummit application

---

## Portfolio Narrative

**Personal Brand:** Accessibility + Transit + Civic Tech

**Why this portfolio works:**
1. **Personal project demonstrates technical depth:** Core algorithm (haversine), tests, CI/CD, documentation
2. **External PRs show community engagement:** Contributions to 2 different repos (advocacy + open data)
3. **Lisbon focus + accessibility angle:** Niche expertise, not just generic code
4. **Teaching (dev.to post):** Visibility + knowledge sharing

**For WebSummit application:**
- Link to live demo: `https://devotedpronet-cyber.github.io/transit-accessibility-planner`
- Link to repo: `https://github.com/devotedpronet-cyber/transit-accessibility-planner`
- Links to 3 merged PRs (once landed)
- Link to teaching post (once published)

---

## Technical Stack
- **Frontend:** JavaScript (ES modules), Leaflet.js, HTML/CSS
- **Backend Logic:** Haversine distance, accessibility filtering
- **Testing:** Jest (100% coverage target for core logic)
- **CI/CD:** GitHub Actions (test + deploy)
- **Deployment:** GitHub Pages

---

## Next Actions
1. Fork all-aboard-ohio/communication-guides → submit PR #1
2. Fork devpt-org/public-data-portugal → submit PR #2
3. Research Lisbon GTFS feed → integrate real data
4. Write dev.to post: "Building Accessible Transit Apps"
5. Submit WebSummit application with 3 PR links

---

*Updated: 2026-09-01*
