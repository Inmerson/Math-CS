# Reliable Pages and Matrix Input Design

## Goal

Restore reproducible GitHub Pages delivery and reduce unnecessary matrix-grid re-renders while preserving current user behavior.

## Architecture

The repository already publishes GitHub Pages from the root of `main` in legacy branch mode. The application therefore produces a dedicated, browser-ready bundle in `site/`, which is served at `/Math-Biotech-Project/site/` without changing repository settings. CI and publishing use the same Node.js version, lock file and verification command so development checks and production output do not drift.

Matrix cells keep temporary text locally while the user types. A validated numeric value is committed to the parent matrix only when editing ends through blur or Enter, reducing parent updates from one per keystroke to one per edit session.

## Components

- `package-lock.json`: synchronized with `package.json`, including Tailwind PostCSS and the current React Three Fiber version.
- `tsconfig.json`: limits client typechecking to the client codebase; the independently managed `server/` project is excluded.
- `.github/workflows/ci.yml`: installs optional native packages from the lock file and runs typecheck, tests and the production build.
- `.github/workflows/deploy.yml`: verifies the application, builds the Pages-specific bundle, stores an artifact and commits generated `site/` files to `main`.
- `components/MatrixInput.tsx`: local edit buffer with explicit commit behavior.
- `components/MatrixInput.test.tsx`: regression tests for deferred updates and Enter-key completion.

## Error handling

Invalid intermediate text remains local during editing. Empty text commits as zero; other non-numeric text leaves the previous matrix value unchanged. Publishing stops before changing `site/` whenever dependency installation, typecheck, tests or either production build fails.

## Verification

A pull request must pass `npm run verify`. After merging, the publishing workflow must build and commit `site/`; a subsequent authenticated repository commit activates the legacy Pages build. The public application is verified at `https://inmerson.github.io/Math-Biotech-Project/site/`.
