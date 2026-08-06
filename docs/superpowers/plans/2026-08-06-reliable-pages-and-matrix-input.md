# Reliable Pages and Matrix Input Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore reproducible GitHub Pages delivery and ship the tested MatrixInput render optimization.

**Architecture:** Reuse the synchronized dependency lock and tested MatrixInput change from the reviewed optimization branch. Standardize CI and publishing on Node.js 22, build a Pages-specific bundle into `site/`, and require the shared `npm run verify` gate before generated files are committed.

**Tech Stack:** React 19, TypeScript, Vite 6, Vitest 4, npm lockfile v3, GitHub Actions, GitHub Pages.

## Global Constraints

- Preserve the repository's existing `main`-root GitHub Pages source setting.
- Publish the browser-ready application at `/Math-Biotech-Project/site/`.
- Use Node.js 22 in CI and publishing.
- Use `npm ci --include=optional` for reproducible native dependency installation.
- Do not publish when typecheck, tests or production builds fail.
- Keep matrix editing behavior compatible with blur and Enter workflows.

---

### Task 1: Synchronize dependencies

**Files:**
- Modify: `package-lock.json`

- [x] Replace the stale lock file with the reviewed synchronized lock from `copilot/review-and-merge-prs-6-7`.
- [x] Run `npm ci --include=optional` in GitHub Actions and confirm installation succeeds.

### Task 2: Add MatrixInput regression coverage and implementation

**Files:**
- Modify: `components/MatrixInput.tsx`
- Create: `components/MatrixInput.test.tsx`

- [x] Add tests proving parent `onChange` is deferred until blur and committed once.
- [x] Add test coverage for Enter-key completion.
- [x] Replace per-keystroke parent updates with a local edit buffer and explicit commit.
- [ ] Confirm the tests pass in the pull request workflow.

### Task 3: Correct client typecheck boundaries

**Files:**
- Modify: `tsconfig.json`

- [x] Exclude `server/`, which is an independently managed Node project with its own package and TypeScript configuration.
- [ ] Confirm client typechecking succeeds without hiding client source files.

### Task 4: Publish the static application

**Files:**
- Modify: `package.json`
- Modify: `.github/workflows/deploy.yml`

- [x] Add `build:pages` with base `/Math-Biotech-Project/site/` and output directory `site/`.
- [x] Verify before creating the Pages-specific bundle.
- [x] Upload the generated site as a workflow artifact.
- [x] Commit changed `site/` output to `main` with the GitHub Actions bot.
- [ ] Merge and confirm the publishing workflow succeeds.

### Task 5: Production verification

**Files:**
- No source changes expected beyond a deployment trigger marker.

- [ ] Trigger a Pages rebuild after generated `site/` files exist.
- [ ] Open `https://inmerson.github.io/Math-Biotech-Project/site/`.
- [ ] Confirm the dashboard renders.
- [ ] Confirm matrix inputs accept decimal typing and commit on blur or Enter.
- [ ] Confirm the latest CI and publishing runs are successful.
