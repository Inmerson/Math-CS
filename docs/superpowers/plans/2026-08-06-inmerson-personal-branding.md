# Inmerson Personal Branding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace university attribution with a consistent personal brand: `Inmerson • Personal Math & Biotech Lab`.

**Architecture:** Add a small typed branding module for React-facing copy, then update static platform metadata with the same approved strings. Preserve mathematical and biotechnology learning terminology while removing external institutional ownership.

**Tech Stack:** React 19, TypeScript, Vitest, Vite, PWA manifest, Capacitor, Android resources, Express.

## Global Constraints

- Primary name is exactly `Inmerson`.
- Signature is exactly `Personal Math & Biotech Lab`.
- Formal name is exactly `Inmerson • Personal Math & Biotech Lab`.
- Compact name is exactly `Inmerson Lab`.
- Do not retain `Warsaw University of Life Sciences` or `SGGW` in current user-facing source or metadata.
- Do not change package IDs, URLs, mathematical content, or application behavior.

---

### Task 1: Establish tested branding constants

**Files:**
- Create: `data/branding.test.ts`
- Create: `data/branding.ts`

**Interfaces:**
- Produces: `BRAND_NAME`, `BRAND_TAGLINE`, `BRAND_FULL_NAME`, `BRAND_SHORT_NAME`, and `BRAND_DESCRIPTION` string constants.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import {
  BRAND_DESCRIPTION,
  BRAND_FULL_NAME,
  BRAND_NAME,
  BRAND_SHORT_NAME,
  BRAND_TAGLINE,
} from './branding';

describe('personal branding', () => {
  it('uses the approved Inmerson identity', () => {
    expect(BRAND_NAME).toBe('Inmerson');
    expect(BRAND_TAGLINE).toBe('Personal Math & Biotech Lab');
    expect(BRAND_FULL_NAME).toBe('Inmerson • Personal Math & Biotech Lab');
    expect(BRAND_SHORT_NAME).toBe('Inmerson Lab');
  });

  it('contains no university attribution', () => {
    const branding = [BRAND_NAME, BRAND_TAGLINE, BRAND_FULL_NAME, BRAND_SHORT_NAME, BRAND_DESCRIPTION].join(' ');
    expect(branding).not.toContain('Warsaw University of Life Sciences');
    expect(branding).not.toContain('SGGW');
  });
});
```

- [ ] **Step 2: Run verification and confirm RED**

Run: `npm run verify`

Expected: TypeScript fails because `./branding` does not exist.

- [ ] **Step 3: Add the minimal branding module**

```ts
export const BRAND_NAME = 'Inmerson';
export const BRAND_TAGLINE = 'Personal Math & Biotech Lab';
export const BRAND_FULL_NAME = `${BRAND_NAME} • ${BRAND_TAGLINE}`;
export const BRAND_SHORT_NAME = 'Inmerson Lab';
export const BRAND_DESCRIPTION = 'A personal interactive laboratory for mathematical modeling, biotechnology, observation and learning.';
```

- [ ] **Step 4: Run tests and confirm GREEN**

Run: `npm run verify`

Expected: branding tests and all existing checks pass.

### Task 2: Apply branding to React surfaces

**Files:**
- Modify: `views/DashboardView.tsx`
- Modify: `components/Sidebar.tsx`
- Modify: `views/AIChatView.tsx`

**Interfaces:**
- Consumes: constants exported by `data/branding.ts`.

- [ ] **Step 1: Update the dashboard hero**

Import `BRAND_NAME`, `BRAND_TAGLINE`, and `BRAND_DESCRIPTION`. Render `BRAND_NAME` as the hero heading, `BRAND_TAGLINE` as a prominent signature, and `BRAND_DESCRIPTION` as supporting copy.

- [ ] **Step 2: Update compact navigation identity**

Import `BRAND_SHORT_NAME` in `Sidebar.tsx` and replace the `Math Biotech` heading with it.

- [ ] **Step 3: Update AI introduction**

Import `BRAND_SHORT_NAME` in `AIChatView.tsx` and introduce the assistant as `${BRAND_SHORT_NAME} Assistant`.

- [ ] **Step 4: Run verification**

Run: `npm run verify`

Expected: Typecheck, all tests, and production build succeed.

### Task 3: Apply branding to platform and repository metadata

**Files:**
- Modify: `index.html`
- Modify: `manifest.json`
- Modify: `metadata.json`
- Modify: `capacitor.config.ts`
- Modify: `android/app/src/main/res/values/strings.xml`
- Modify: `README.md`
- Modify: `server/src/index.ts`

**Interfaces:**
- Static surfaces use the exact approved strings from Global Constraints.

- [ ] **Step 1: Update browser and PWA identity**

Set the HTML title and manifest full name to `Inmerson • Personal Math & Biotech Lab`; set manifest short name to `Inmerson Lab`.

- [ ] **Step 2: Update application metadata**

Set metadata name to the formal brand and description to the personal-lab description.

- [ ] **Step 3: Update installed app labels**

Set Capacitor and Android visible app names to `Inmerson Lab`. Preserve `com.inmersion.mathbiotech` identifiers.

- [ ] **Step 4: Update public project and API identity**

Change the README heading to the formal brand. Rename API display messages to `Inmerson Lab API` without changing endpoints or behavior.

- [ ] **Step 5: Run full verification**

Run: `npm run verify`

Expected: 0 type errors, 0 failed tests, successful Vite production build.

### Task 4: Verify removal and deploy

**Files:**
- Generated by workflow: `site/**`

- [ ] **Step 1: Search current source**

Search for `Warsaw University of Life Sciences` and `SGGW` in the branch. Expected: no current source matches except historical documentation or git history; no user-facing current file matches.

- [ ] **Step 2: Open and merge the pull request**

Create a PR describing the personal brand, red-green test evidence, and metadata updates. Merge only after CI succeeds.

- [ ] **Step 3: Verify main and Pages workflows**

Confirm main CI succeeds and the Pages publishing workflow commits fresh `site/` output.

- [ ] **Step 4: Verify live deployment**

Confirm the latest Pages build status is `built`, and `site/index.html` references the newly generated assets and formal browser title.
