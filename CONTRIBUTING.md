# Contributing

🇵🇹 [Ler em português](CONTRIBUTING.pt-PT.md)

Thanks for considering a contribution to the Lisbon Transit Accessibility Planner.

## Project scope

This is a small, dependency-light static web app: vanilla JS (ES modules), Leaflet.js for maps, no bundler, deployed as static files (GitHub Pages). Keep changes in that spirit — avoid introducing a build step, framework, or bundler unless there's a strong reason and it's discussed first in an issue.

The core rule that shapes almost every decision here: **never fabricate accessibility data**. A stop is either `known-accessible` (confirmed via an official source) or `unknown`. If you're unsure whether upstream data justifies a change from `unknown` to `known-accessible`, open an issue first.

## Getting started

```bash
git clone <repo-url>
cd experiment1
npm install
npm test           # run tests with coverage
open index.html    # open the app in your browser
```

No API keys required — stop data comes from the public Carris Metropolitana API, with a bundled offline fixture as fallback.

## File structure

- `app.js` — core logic (distance calc, nearby-stop search, result formatting)
- `app.test.js` — unit tests for `app.js`
- `stops.js` — loads live stop data from the Carris Metropolitana API, with offline fixture fallback
- `map.js` — Leaflet map rendering
- `mapColors.js` — accessibility-to-color/label mapping for map markers
- `map.test.js` — tests for `map.js`
- `index.html` — browser UI (includes translated strings for 7 languages)
- `docs/ARCHITECTURE.md` — design rationale
- `WORK_PLAN_MOBILE.md` — active backlog and phase-by-phase progress log

## Making changes

1. Open an issue first for anything beyond a small fix — especially anything touching accessibility data, the map, or the UI copy.
2. Write or update tests for any logic change in `app.js`, `map.js`, or `stops.js`. Coverage target is 70%+.
3. Run `npm test` before opening a PR. CI runs the same suite on every push.
4. If you touch `index.html` UI copy, update all 7 language variants, not just English.
5. Keep PRs focused — one concern per PR is easier to review and easier to revert if something's wrong.

## Accessibility data changes

If you're adding or correcting a `known-accessible` entry in `stops.js`:

- Cite the source (official transit authority announcement, or a specific OSM node/tag with `wheelchair=yes`).
- If your source disagrees with an existing entry, don't silently overwrite it — add a comment documenting the disagreement and which source you're trusting, and why.
- Never mark a stop `known-accessible` on inference or guesswork. When in doubt, it stays `unknown`.

## Reporting bugs / requesting features

Open a GitHub issue. Include steps to reproduce for bugs, or the use case for feature requests.
