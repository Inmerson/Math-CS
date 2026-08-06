# Inmerson Personal Branding Design

## Goal

Remove all Warsaw University of Life Sciences and SGGW attribution from the product, and present the application as a personal learning laboratory owned by Inmerson.

## Brand system

- Primary name: `Inmerson`
- Descriptive signature: `Personal Math & Biotech Lab`
- Full formal name: `Inmerson • Personal Math & Biotech Lab`
- Compact product reference: `Inmerson Lab`

`Math Biotech` may remain as a description of the learning domain, but it must not be presented as an institution or external owner.

## User interface

The dashboard hero will lead with `Inmerson`, followed by the signature `Personal Math & Biotech Lab`. The supporting sentence will describe the application as a personal interactive laboratory for mathematical modeling and biotechnology, without mentioning any university.

The sidebar will use `Inmerson Lab` as the compact identity so the narrow layout remains readable. The AI assistant will introduce itself as the Inmerson Lab assistant.

## Platform metadata

The browser title, PWA manifest, application metadata, Capacitor app name, and Android labels will use the personal brand. The repository README and backend API identity will also describe the project as Inmerson Lab so public and installed surfaces remain consistent.

## Architecture

A small `data/branding.ts` module will hold shared React-facing brand constants. Components will import these constants instead of duplicating names. Static files that cannot import TypeScript will use the exact same approved strings directly.

## Testing

A branding unit test will establish the approved name hierarchy and assert that exported branding contains neither `Warsaw University of Life Sciences` nor `SGGW`. Existing typecheck, unit tests, and production build must remain green.

## Success criteria

1. No current source or generated user-facing metadata attributes the project to Warsaw University of Life Sciences or SGGW.
2. Dashboard, sidebar, AI greeting, browser/PWA/mobile metadata, README, and API identity consistently use the Inmerson personal brand.
3. The branding regression test, full test suite, typecheck, production build, and GitHub Pages deployment succeed.
