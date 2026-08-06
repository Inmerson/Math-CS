# Cosmic Black Hole UI Verification

**Date:** 2026-08-06  
**Branch:** `design/cosmic-black-hole-ui`  
**Verified source head:** `a7690bd6b73d940001fff227cc86d485cba90d7c`

## Fresh verification commands

- `npm run verify` — typecheck, complete Vitest suite, domain-clean scan, and production build.
- `npm run build:pages` — GitHub Pages build using `/Math-CS/` base path.
- `npm --prefix server ci --include=optional` and `npm --prefix server run build` — optional API dependency and TypeScript build validation.
- Generated-site assertions — Pages asset paths, hero copy, cosmic CSS selectors, runtime hero reference, transfer budget, and dashboard-only photorealistic-asset usage.

## Acceptance mapping

- Cinematic photorealistic black-hole hero is isolated to `CosmicHero`.
- Dashboard retains search, two courses, Math Lab, and Formula Workspace navigation.
- Math I and Math II have stable blue and violet identities.
- Internal reading, labs, assessment, progress, formula, and assistant views use restrained cosmic surfaces.
- Mobile layout includes safe-area padding, 44 px coarse-pointer targets, compact navigation, and stacked hero treatment.
- Image failure and reduced-motion modes retain readable educational content.
- No account, notification, analytics, cloud persistence, arbitrary expression execution, or new WebGL dependency was added.
