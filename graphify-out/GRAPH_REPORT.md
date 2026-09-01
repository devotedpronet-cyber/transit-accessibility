# Graph Report - experiment1  (2026-09-01)

## Corpus Check
- 19 files · ~82,375 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 124 nodes · 142 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.85)
- Token cost: 276,697 input · 0 output

## Community Hubs (Navigation)
- Project Narrative & Docs
- PWA Manifest
- Map Rendering & Stop Data
- Mobile Roadmap & Stale Doc Refs
- Test Coverage Config
- Deployment & Portfolio Strategy
- Package Metadata
- GPS Location Flow
- Distance & Stop Filtering Logic
- Generated Image: Cage Card Terminal
- Generated Image: Payment Legal Action
- Generated Image: Payment Card Regulation
- Leaflet Map Usage

## God Nodes (most connected - your core abstractions)
1. `Transit Accessibility Planner (Portfolio Project)` - 8 edges
2. `loadStops()` - 6 edges
3. `Mobile-First iOS Transit App Goal` - 6 edges
4. `jest` - 5 edges
5. `global` - 5 edges
6. `Accessible Journey Planner Solution` - 5 edges
7. `findNearestStepFreeStops() Function` - 5 edges
8. `renderStops()` - 4 edges
9. `colorForAccessibility()` - 4 edges
10. `labelForAccessibility()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `findNearestStepFreeStops() Function` --semantically_similar_to--> `Haversine Distance Calculation`  [INFERRED] [semantically similar]
  docs/ARCHITECTURE.md → PORTFOLIO.md
- `Static Host Deployment (GitHub Pages/Netlify)` --semantically_similar_to--> `GitHub Pages Deployment`  [INFERRED] [semantically similar]
  README.md → PORTFOLIO.md
- `Portfolio Narrative Strategy` --semantically_similar_to--> `Accessibility Information Gap Problem`  [INFERRED] [semantically similar]
  PORTFOLIO.md → README.md
- `Accessibility Polish (ARIA, Keyboard Nav, Screen Reader)` --semantically_similar_to--> `Step-Free Stop Search Feature`  [INFERRED] [semantically similar]
  WORK_PLAN_MOBILE.md → README.md
- `Real-Time Distance Calculation Feature` --semantically_similar_to--> `getDistance() Function (Haversine)`  [INFERRED] [semantically similar]
  README.md → docs/ARCHITECTURE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Accessibility-First Design Focus** — readme_problem_statement, docs_architecture_approach, work_plan_mobile_accessibility_polish, portfolio_narrative [INFERRED 0.85]
- **GitHub Pages Static Deployment** — readme_deployment, portfolio_github_pages, work_plan_mobile_gh_pages_deployment, _github_workflows_test_ci_workflow [INFERRED 0.85]
- **GPS Geolocation Integration Flow** — work_plan_mobile_phase2, index_html_requestlocation, index_html_setupgps, index_html_addaccuracycircle [INFERRED 0.85]

## Communities (13 total, 2 thin omitted)

### Community 0 - "Project Narrative & Docs"
Cohesion: 0.13
Nodes (17): Lightweight Frontend-First Architecture, Data Flow Pipeline, findNearestStepFreeStops() Function, formatResults() Function, getDistance() Function (Haversine), dev.to Teaching Post, Haversine Distance Calculation, Portfolio Narrative Strategy (+9 more)

### Community 1 - "PWA Manifest"
Cohesion: 0.12
Nodes (15): background_color, categories, description, display, icons, name, orientation, scope (+7 more)

### Community 2 - "Map Rendering & Stop Data"
Cohesion: 0.23
Nodes (11): initMap(), markers, renderStops(), stops, colorForAccessibility(), labelForAccessibility(), fetchFromCarrisMetropolitana(), FIXTURE_STOPS (+3 more)

### Community 3 - "Mobile Roadmap & Stale Doc Refs"
Cohesion: 0.13
Nodes (15): Future Extensions (Real API, Map, Preferences, Mobile), mockStops Data, Bottom Sheet UI Pattern, manifest.json Reference (PWA), index.html App Shell, Step-Free Stop Search Feature, Accessibility Polish (ARIA, Keyboard Nav, Screen Reader), Mobile-First iOS Transit App Goal (+7 more)

### Community 4 - "Test Coverage Config"
Cohesion: 0.15
Nodes (14): global, branches, functions, lines, statements, jest, coveragePathIgnorePatterns, coverageThreshold (+6 more)

### Community 5 - "Deployment & Portfolio Strategy"
Cohesion: 0.18
Nodes (11): CI Test Workflow, GitHub Actions CI/CD Pipeline, GitHub Pages Deployment, Leaflet.js Map Integration, PR #1 - all-aboard-ohio/communication-guides, PR #2 - devpt-org/public-data-portugal, devotedpronet-cyber/transit-accessibility-planner Repo, Transit Accessibility Planner (Portfolio Project) (+3 more)

### Community 6 - "Package Metadata"
Cohesion: 0.20
Nodes (9): jest, description, devDependencies, jest, name, scripts, test, type (+1 more)

### Community 7 - "GPS Location Flow"
Cohesion: 0.32
Nodes (8): addAccuracyCircle() Function, DOMContentLoaded Handler, loadDefaults() Function, requestLocation() Function, window.search() Function, setupGPS() Function, Geolocation API Integration, Phase 2 - Real GPS Integration

### Community 8 - "Distance & Stop Filtering Logic"
Cohesion: 0.48
Nodes (5): findNearestStops(), formatResults(), getDistance(), NOTE: real GTFS data for the Lisbon area does not carry reliable, testStops

### Community 9 - "Generated Image: Cage Card Terminal"
Cohesion: 0.83
Nodes (4): Stacks of Blank Plastic Cards, Casino Cage Card Payment Terminal, Blank Cards, Cage Card Terminal, and Gavel, Legal Ruling / Gavel Judgment

### Community 10 - "Generated Image: Payment Legal Action"
Cohesion: 1.00
Nodes (3): Gavel and Payment Terminal Illustration, Legal/Regulatory Authority (Gavel), Payment Processing / POS Terminal

## Knowledge Gaps
- **50 isolated node(s):** `testStops`, `name`, `short_name`, `description`, `start_url` (+45 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 54 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Mobile-First iOS Transit App Goal` connect `Mobile Roadmap & Stale Doc Refs` to `Deployment & Portfolio Strategy`, `GPS Location Flow`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `Transit Accessibility Planner (Portfolio Project)` connect `Deployment & Portfolio Strategy` to `Project Narrative & Docs`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `testStops`, `name`, `short_name` to the rest of the system?**
  _50 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Project Narrative & Docs` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
- **Should `PWA Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Mobile Roadmap & Stale Doc Refs` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._