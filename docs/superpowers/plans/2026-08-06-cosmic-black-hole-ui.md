# Cosmic Black Hole UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Inmerson Math-CS into the approved premium academic sci-fi interface with a photorealistic black-hole dashboard hero, glass navigation shell, course-specific visual identities, and restrained cosmic styling throughout internal learning views.

**Architecture:** Keep all curriculum, persistence, grading, lab, and navigation behavior unchanged. Add a small `components/cosmic` presentation layer, one pure overall-progress selector, a single optimized dashboard hero asset, and reusable CSS tokens/classes so the visual system is consistent without moving business logic into UI components.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6.4, Tailwind CSS 4, Framer Motion 12, Lucide React, Vitest 4, Testing Library, CSS/SVG presentation, WebP asset, GitHub Actions and GitHub Pages.

## Global Constraints

- The strongest photorealistic black-hole image appears only on the dashboard.
- Math I uses blue/cyan accents; Math II uses violet/indigo accents.
- Existing curriculum data, navigation destinations, local progress storage, quiz grading, laboratories, examinations, formulas, and assistant behavior remain functionally unchanged.
- Do not add authentication, notifications, analytics, cloud persistence, remote APIs, or WebGL dependencies.
- The black-hole image is decorative, has no embedded text or watermark, and must retain a CSS gradient fallback.
- All text overlays must remain readable at WCAG AA contrast.
- All interactive controls retain visible `:focus-visible` styling.
- Nonessential animation must respect `prefers-reduced-motion`.
- Desktop sidebar remains approximately 272–288 px; mobile keeps the slide-out sidebar and bottom navigation.
- Run `npm run verify` and `npm run build:pages` before merging or deploying.

---

## File Map

### Create

- `public/assets/cosmic/black-hole-hero.webp` — optimized standalone hero artwork with negative space on the left and event horizon on the upper-right.
- `components/cosmic/CosmicHero.tsx` — dashboard title, tagline, description, luminous divider, and decorative image layer.
- `components/cosmic/CosmicHero.test.tsx` — hero semantics, fallback class, and decorative-image assertions.
- `components/cosmic/CosmicLogoMark.tsx` — CSS/SVG black-hole ring brand mark.
- `components/cosmic/CosmicProgressRing.tsx` — accessible percentage ring used by sidebar and course cards.
- `components/cosmic/CosmicProgressRing.test.tsx` — percentage clamping and accessible-label tests.
- `components/cosmic/CourseVisual.tsx` — lightweight SVG visual for Math I and Math II.
- `components/cosmic/UtilityCard.tsx` — reusable Math Lab / Formula Workspace card.
- `components/cosmic/CosmicPageHeader.tsx` — restrained internal-view header with optional course accent.
- `components/cosmic/CosmicPageHeader.test.tsx` — heading hierarchy and accent tests.
- `scripts/cosmic-assets.test.ts` — verifies required hero asset path and transfer-size budget.

### Modify

- `index.css` — cosmic tokens, glass surfaces, starfield, hero overlays, buttons, focus, responsive behavior, and reduced-motion rules.
- `components/AnimatedBackground.tsx` — subtle global starfield and ambient gradients only.
- `utils/progress.ts` — add pure `getOverallProgress` selector.
- `utils/progress.test.ts` — define overall-progress behavior.
- `App.tsx` — pass overall progress to sidebar and apply shell spacing/classes.
- `App.test.tsx` — verify shell landmark and real overall-progress propagation.
- `components/Sidebar.tsx` — logo mark, integrated navigation groups, active styling, and progress card.
- `components/Sidebar.test.tsx` — brand, progress card, active navigation, and existing navigation coverage.
- `views/DashboardView.tsx` — compose `CosmicHero`, search, course cards, and utility cards.
- `views/DashboardView.test.tsx` — hero/search/course/utility structure and navigation behavior.
- `components/course/CourseCard.tsx` — premium card composition and course-specific accent.
- `components/course/CourseCard.test.tsx` — visual variant, progress semantics, recommendation, and navigation.
- `views/CourseHubView.tsx` — quiet course-specific cosmic header and card hierarchy.
- `views/LessonWorkspaceView.tsx` — reading-focused glass stages and restrained margin atmosphere.
- `views/MathLabView.tsx` — instrument-panel shell without decorative hero imagery.
- `views/PracticeView.tsx` — calm assessment header and panels.
- `views/ExamsView.tsx` — calm assessment header and panels.
- `views/ProgressView.tsx` — shared progress rings/bars and course-separated summary.
- `views/FormulaWorkspaceView.tsx` — technical-notebook surface and faint notation texture.
- `views/AIChatView.tsx` — deep-space console styling while preserving chat readability.
- Existing tests for the views above — preserve behavior and add one visual-system assertion per view where useful.

---

### Task 1: Add the Hero Asset Contract and Optimized Artwork

**Files:**
- Create: `scripts/cosmic-assets.test.ts`
- Create: `public/assets/cosmic/black-hole-hero.webp`

**Interfaces:**
- Consumes: no application code.
- Produces: stable browser path `/assets/cosmic/black-hole-hero.webp` with a maximum size of `900_000` bytes.

- [ ] **Step 1: Write the failing asset test**

```ts
import { describe, expect, it } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

describe('cosmic visual assets', () => {
  it('ships an optimized dashboard black-hole hero', () => {
    const assetPath = resolve(process.cwd(), 'public/assets/cosmic/black-hole-hero.webp');
    expect(existsSync(assetPath)).toBe(true);
    expect(statSync(assetPath).size).toBeLessThanOrEqual(900_000);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npm test -- scripts/cosmic-assets.test.ts
```

Expected: FAIL because `public/assets/cosmic/black-hole-hero.webp` does not exist.

- [ ] **Step 3: Generate the standalone artwork**

Use image generation with this exact content direction:

```text
Wide photorealistic 3D black hole in deep space for a premium academic mathematics web-app hero. Event horizon and realistic gravitational lensing in the upper-right, warm white and restrained pale-gold accretion disk, sparse starfield, deep black and navy space, darker negative space across the entire left half for white interface text, no text, no logo, no watermark, no UI, no person, cinematic but scientifically respectful, 16:7 composition.
```

Do not use the full generated dashboard mockup as the asset.

- [ ] **Step 4: Convert and optimize**

Use Pillow or an equivalent local encoder:

```python
from pathlib import Path
from PIL import Image

source = Path('/mnt/data/generated-black-hole.png')
target = Path('public/assets/cosmic/black-hole-hero.webp')
target.parent.mkdir(parents=True, exist_ok=True)

with Image.open(source) as image:
    image = image.convert('RGB')
    image.thumbnail((1920, 900), Image.Resampling.LANCZOS)
    image.save(target, 'WEBP', quality=82, method=6)
```

- [ ] **Step 5: Run the asset test and full verification**

```bash
npm test -- scripts/cosmic-assets.test.ts
npm run verify
```

Expected: PASS; the asset exists and stays below 900 KB.

- [ ] **Step 6: Commit**

```bash
git add scripts/cosmic-assets.test.ts public/assets/cosmic/black-hole-hero.webp
git commit -m "feat: add optimized cosmic hero asset"
```

---

### Task 2: Establish the Cosmic Visual Tokens and Global Background

**Files:**
- Modify: `index.css`
- Modify: `components/AnimatedBackground.tsx`
- Create: `components/AnimatedBackground.test.tsx`

**Interfaces:**
- Consumes: existing Tailwind 4 import and `prefers-reduced-motion` rules.
- Produces: reusable classes `cosmic-shell`, `cosmic-glass`, `cosmic-card`, `cosmic-divider`, `cosmic-button`, `cosmic-glow-blue`, and `cosmic-glow-violet`.

- [ ] **Step 1: Write the failing background test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimatedBackground } from './AnimatedBackground';

describe('AnimatedBackground', () => {
  it('renders decorative restrained cosmic layers', () => {
    render(<AnimatedBackground />);
    const background = screen.getByTestId('cosmic-background');
    expect(background).toHaveAttribute('aria-hidden', 'true');
    expect(background).toHaveClass('cosmic-shell');
    expect(background.querySelectorAll('[data-cosmic-layer]')).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Verify RED**

```bash
npm test -- components/AnimatedBackground.test.tsx
```

Expected: FAIL because the test id, shell class, and layer markers do not exist.

- [ ] **Step 3: Add exact CSS tokens and reusable surfaces**

Add these tokens at `:root` and retain the existing Tailwind 4 import:

```css
:root {
  color-scheme: dark;
  --cosmic-void: #030711;
  --cosmic-navy: #07111f;
  --cosmic-surface: #0b1726;
  --cosmic-raised: #101d30;
  --cosmic-text: #f5f7fb;
  --cosmic-muted: #9aa9bd;
  --cosmic-blue: #62a8ff;
  --cosmic-cyan: #67e8f9;
  --cosmic-violet: #a78bfa;
  --cosmic-indigo: #7c83ff;
  --cosmic-gold: #f4d7aa;
  --cosmic-border: rgba(165, 190, 225, 0.16);
}

.cosmic-shell { background: var(--cosmic-void); }
.cosmic-glass {
  border: 1px solid var(--cosmic-border);
  background: linear-gradient(145deg, rgba(12, 25, 43, 0.86), rgba(5, 12, 24, 0.78));
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px);
}
.cosmic-card { transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease; }
.cosmic-card:hover { transform: translateY(-2px); }
.cosmic-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(98,168,255,.8), transparent); }
.cosmic-button { border: 1px solid rgba(255,255,255,.16); box-shadow: inset 0 1px rgba(255,255,255,.12), 0 8px 24px rgba(0,0,0,.22); }
.cosmic-glow-blue { box-shadow: 0 0 42px rgba(56, 139, 253, 0.12); }
.cosmic-glow-violet { box-shadow: 0 0 42px rgba(139, 92, 246, 0.12); }
```

Add restrained starfield pseudo-elements and ensure the reduced-motion media query disables drift.

- [ ] **Step 4: Implement the three global decorative layers**

```tsx
export const AnimatedBackground: React.FC = () => (
  <div data-testid="cosmic-background" aria-hidden="true" className="cosmic-shell pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div data-cosmic-layer="nebula" className="absolute inset-0 bg-[radial-gradient(circle_at_80%_8%,rgba(98,168,255,.12),transparent_32%),linear-gradient(180deg,#030711_0%,#07111f_58%,#030711_100%)]" />
    <div data-cosmic-layer="stars" className="cosmic-starfield absolute inset-0" />
    <div data-cosmic-layer="grid" className="coordinate-grid absolute inset-0 opacity-25" />
  </div>
);
```

- [ ] **Step 5: Verify GREEN and build**

```bash
npm test -- components/AnimatedBackground.test.tsx scripts/tailwind-output.test.ts
npm run build
```

Expected: PASS; Tailwind still emits required utilities.

- [ ] **Step 6: Commit**

```bash
git add index.css components/AnimatedBackground.tsx components/AnimatedBackground.test.tsx
git commit -m "feat: establish cosmic visual system"
```

---

### Task 3: Add Shared Cosmic Primitives and Overall Progress

**Files:**
- Create: `components/cosmic/CosmicLogoMark.tsx`
- Create: `components/cosmic/CosmicProgressRing.tsx`
- Create: `components/cosmic/CosmicProgressRing.test.tsx`
- Create: `components/cosmic/CourseVisual.tsx`
- Modify: `utils/progress.ts`
- Modify: `utils/progress.test.ts`

**Interfaces:**
- Produces: `getOverallProgress(state: MathCsState, courses: readonly CourseDefinition[]): number`.
- Produces: `CosmicProgressRing({ value, label, size?: 'sm' | 'md' | 'lg', accent?: 'blue' | 'violet' })`.
- Produces: `CourseVisual({ courseId }: { courseId: CourseId })`.

- [ ] **Step 1: Write the failing overall-progress test**

```ts
import { COURSES } from '../data/courseCatalog';
import { getOverallProgress } from './progress';

it('calculates overall completion across both courses', () => {
  const empty = createDefaultMathCsState();
  expect(getOverallProgress(empty, COURSES)).toBe(0);

  const firstHalf = COURSES[0].topics.slice(0, 4)
    .reduce((state, topic) => markTopicComplete(state, topic.id), empty);
  expect(getOverallProgress(firstHalf, COURSES)).toBe(24);
});
```

The expected value is `4 completed / 17 total = 23.529...`, rounded to `24`.

- [ ] **Step 2: Verify RED**

```bash
npm test -- utils/progress.test.ts
```

Expected: FAIL because `getOverallProgress` is not exported.

- [ ] **Step 3: Implement the selector**

```ts
export const getOverallProgress = (
  state: MathCsState,
  courses: readonly CourseDefinition[],
): number => {
  const topics = courses.flatMap((course) => course.topics);
  if (topics.length === 0) return 0;
  const completed = topics.filter((topic) => state.completedTopicIds.includes(topic.id)).length;
  return Math.round((completed / topics.length) * 100);
};
```

- [ ] **Step 4: Write the failing progress-ring test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CosmicProgressRing } from './CosmicProgressRing';

describe('CosmicProgressRing', () => {
  it('clamps the percentage and exposes an accessible label', () => {
    render(<CosmicProgressRing value={142} label="Overall progress" />);
    expect(screen.getByRole('img', { name: 'Overall progress: 100%' })).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Verify RED**

```bash
npm test -- components/cosmic/CosmicProgressRing.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 6: Implement the ring and decorative SVGs**

Use CSS `conic-gradient` for the ring, clamp via `Math.min(100, Math.max(0, Math.round(value)))`, and mark `CosmicLogoMark` / `CourseVisual` SVGs with `aria-hidden="true"`.

```tsx
const safeValue = Math.min(100, Math.max(0, Math.round(value)));
return (
  <div role="img" aria-label={`${label}: ${safeValue}%`} className={`cosmic-progress-ring cosmic-progress-ring--${size} cosmic-progress-ring--${accent}`} style={{ '--progress': `${safeValue * 3.6}deg` } as React.CSSProperties}>
    <span>{safeValue}%</span>
  </div>
);
```

- [ ] **Step 7: Verify shared primitives**

```bash
npm test -- utils/progress.test.ts components/cosmic/CosmicProgressRing.test.tsx
npm run typecheck
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add utils/progress.ts utils/progress.test.ts components/cosmic
git commit -m "feat: add cosmic UI primitives and overall progress"
```

---

### Task 4: Redesign the Application Shell and Sidebar

**Files:**
- Modify: `App.tsx`
- Modify: `App.test.tsx`
- Modify: `components/Sidebar.tsx`
- Modify: `components/Sidebar.test.tsx`

**Interfaces:**
- `Sidebar` gains required prop `overallProgress: number`.
- `App` derives it with `getOverallProgress(state, COURSES)` and passes it down.

- [ ] **Step 1: Update Sidebar tests first**

```tsx
render(
  <Sidebar
    destination={{ section: 'dashboard' }}
    onNavigate={vi.fn()}
    isOpen
    onClose={vi.fn()}
    overallProgress={42}
  />,
);
expect(screen.getByText('Inmerson')).toBeInTheDocument();
expect(screen.getByText('Math-CS')).toBeInTheDocument();
expect(screen.getByRole('img', { name: 'Overall progress: 42%' })).toBeInTheDocument();
expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
```

Keep the existing old-domain exclusion assertions.

- [ ] **Step 2: Verify RED**

```bash
npm test -- components/Sidebar.test.tsx
```

Expected: TypeScript/test failure because `overallProgress` is not accepted and no ring exists.

- [ ] **Step 3: Implement the premium sidebar**

- Use `CosmicLogoMark` beside the two-line brand.
- Keep all existing navigation destinations.
- Move Formulas and Assistant into the same visual navigation rhythm below a fine divider.
- Render a bottom `cosmic-glass` progress card with `CosmicProgressRing`.
- Keep the mobile overlay and close button.
- Use a 72-width sidebar (`w-72`) and preserve `md:translate-x-0`.

- [ ] **Step 4: Update App test first**

Add a state fixture with four completed topics and assert the sidebar displays `24%`:

```tsx
const seeded = COURSES[0].topics.slice(0, 4).reduce(
  (state, topic) => markTopicComplete(state, topic.id),
  createDefaultMathCsState(),
);
localStorage.setItem(MATH_CS_STORAGE_KEY, JSON.stringify(seeded));
render(<App />);
expect(screen.getByRole('img', { name: 'Overall progress: 24%' })).toBeInTheDocument();
```

- [ ] **Step 5: Verify RED**

```bash
npm test -- App.test.tsx
```

Expected: FAIL because App does not derive or pass overall progress.

- [ ] **Step 6: Update App shell**

```tsx
const overallProgress = getOverallProgress(state, COURSES);
```

Pass `overallProgress` to `Sidebar`, use `cosmic-shell`, retain exactly one `<main>`, keep the mobile header, and preserve `md:ml-72` so the content aligns with the sidebar.

- [ ] **Step 7: Verify shell and navigation**

```bash
npm test -- App.test.tsx components/Sidebar.test.tsx components/layout/BottomNavigation.test.tsx
npm run typecheck
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add App.tsx App.test.tsx components/Sidebar.tsx components/Sidebar.test.tsx
git commit -m "feat: redesign cosmic application shell"
```

---

### Task 5: Build the Cinematic Dashboard Hero and Utility Cards

**Files:**
- Create: `components/cosmic/CosmicHero.tsx`
- Create: `components/cosmic/CosmicHero.test.tsx`
- Create: `components/cosmic/UtilityCard.tsx`
- Modify: `views/DashboardView.tsx`
- Modify: `views/DashboardView.test.tsx`

**Interfaces:**
- `CosmicHero` consumes `{ title: string; tagline: string; description: string }`.
- `UtilityCard` consumes `{ title, description, icon, accent, onActivate, decoration }`.
- Dashboard search behavior and `AppDestination` callbacks remain unchanged.

- [ ] **Step 1: Write the failing hero test**

```tsx
render(<CosmicHero title="Inmerson Math-CS" tagline="Interactive Mathematics for Computer Science" description="Academic workspace" />);
expect(screen.getByRole('heading', { level: 1, name: 'Inmerson Math-CS' })).toBeInTheDocument();
expect(screen.getByText('Interactive Mathematics for Computer Science')).toBeInTheDocument();
expect(screen.getByTestId('black-hole-hero')).toHaveClass('cosmic-hero-fallback');
expect(screen.getByRole('img', { name: '' })).toHaveAttribute('src', '/assets/cosmic/black-hole-hero.webp');
```

The `<img>` must use `alt=""` because it is decorative.

- [ ] **Step 2: Verify RED**

```bash
npm test -- components/cosmic/CosmicHero.test.tsx
```

Expected: FAIL because `CosmicHero` does not exist.

- [ ] **Step 3: Implement `CosmicHero`**

Use a semantic `<header>`, a CSS gradient fallback, a right-positioned `<img>`, two dark overlays, and a left content column. Do not add fake notification or avatar controls.

- [ ] **Step 4: Expand the Dashboard test before implementation**

```tsx
const onNavigate = vi.fn();
render(<DashboardView state={createDefaultMathCsState()} onNavigate={onNavigate} />);
expect(screen.getByRole('heading', { level: 1, name: 'Inmerson Math-CS' })).toBeInTheDocument();
expect(screen.getByRole('searchbox', { name: 'Search course topics' })).toBeInTheDocument();
expect(screen.getAllByTestId('course-card')).toHaveLength(2);
expect(screen.getByRole('button', { name: /Math Lab/i })).toBeInTheDocument();
expect(screen.getByRole('button', { name: /Formula Workspace/i })).toBeInTheDocument();
```

Add a click assertion verifying Math Lab still calls `onNavigate({ section: 'math-lab' })`.

- [ ] **Step 5: Verify RED**

```bash
npm test -- views/DashboardView.test.tsx
```

Expected: FAIL until the new semantic utility cards and hero are composed.

- [ ] **Step 6: Refactor DashboardView into clear sections**

Compose in this order:

```tsx
<CosmicHero ... />
<section aria-label="Search mathematics topics">...</section>
<section aria-label="Courses">...</section>
<section aria-label="Learning tools">...</section>
```

Keep search results and navigation logic exactly as-is. Use `UtilityCard` for Math Lab and Formula Workspace; use blue for Math Lab and violet for Formula Workspace.

- [ ] **Step 7: Verify hero and dashboard**

```bash
npm test -- components/cosmic/CosmicHero.test.tsx views/DashboardView.test.tsx
npm run build
```

Expected: PASS and the asset path resolves in the Vite build.

- [ ] **Step 8: Commit**

```bash
git add components/cosmic/CosmicHero.tsx components/cosmic/CosmicHero.test.tsx components/cosmic/UtilityCard.tsx views/DashboardView.tsx views/DashboardView.test.tsx
git commit -m "feat: add cinematic cosmic dashboard"
```

---

### Task 6: Give Each Course Card a Distinct Premium Identity

**Files:**
- Modify: `components/course/CourseCard.tsx`
- Create: `components/course/CourseCard.test.tsx`

**Interfaces:**
- Retain all existing `CourseCardProps` names and types.
- Use `course.id` to select `blue` for `math-analysis` and `violet` for `linear-algebra-geometry`.
- Reuse `CosmicProgressRing` and `CourseVisual`.

- [ ] **Step 1: Write the failing course-card test**

```tsx
render(
  <CourseCard
    course={mathAnalysisCourse}
    progress={50}
    completedCount={4}
    recommendedTopic={mathAnalysisCourse.topics[4]}
    latestQuiz={{ courseId: 'math-analysis', topicId: 'limits', score: 4, total: 5, percentage: 80, completedAt: '2026-08-01T00:00:00.000Z' }}
    onNavigate={onNavigate}
  />,
);
expect(screen.getByTestId('course-card')).toHaveAttribute('data-accent', 'blue');
expect(screen.getByRole('img', { name: 'Math I progress: 50%' })).toBeInTheDocument();
expect(screen.getByText('80%')).toBeInTheDocument();
expect(screen.getByTestId('course-visual')).toHaveAttribute('data-course', 'math-analysis');
```

Click the CTA and assert `{ section: 'course', courseId: 'math-analysis' }`.

- [ ] **Step 2: Verify RED**

```bash
npm test -- components/course/CourseCard.test.tsx
```

Expected: FAIL because the data attributes, ring, and course visual are not present.

- [ ] **Step 3: Implement the new composition**

Structure each card as:

```text
badge + title + official title | decorative SVG
course description
horizontal progress + circular ring
completed count
recommended next + latest checkpoint
course-specific CTA
```

Use CSS classes selected from a fixed map, never dynamically concatenate arbitrary Tailwind names:

```ts
const variants = {
  'math-analysis': { accent: 'blue', badge: 'text-blue-200 bg-blue-400/10', button: 'from-blue-500 to-indigo-500' },
  'linear-algebra-geometry': { accent: 'violet', badge: 'text-violet-200 bg-violet-400/10', button: 'from-violet-500 to-fuchsia-500' },
} as const;
```

- [ ] **Step 4: Verify cards and dashboard**

```bash
npm test -- components/course/CourseCard.test.tsx views/DashboardView.test.tsx
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/course/CourseCard.tsx components/course/CourseCard.test.tsx
git commit -m "feat: distinguish cosmic course cards"
```

---

### Task 7: Apply Restrained Cosmic Styling to Internal Views

**Files:**
- Create: `components/cosmic/CosmicPageHeader.tsx`
- Create: `components/cosmic/CosmicPageHeader.test.tsx`
- Modify: `views/CourseHubView.tsx`
- Modify: `views/LessonWorkspaceView.tsx`
- Modify: `views/MathLabView.tsx`
- Modify: `views/PracticeView.tsx`
- Modify: `views/ExamsView.tsx`
- Modify: `views/ProgressView.tsx`
- Modify: `views/FormulaWorkspaceView.tsx`
- Modify: `views/AIChatView.tsx`
- Modify: corresponding existing view tests.

**Interfaces:**
- `CosmicPageHeader({ eyebrow, title, description?, accent?: 'blue' | 'violet' | 'neutral', actions? })`.
- No view props or business behavior changes.

- [ ] **Step 1: Write the failing shared-header test**

```tsx
render(
  <CosmicPageHeader
    eyebrow="Math I"
    title="Mathematical Analysis"
    description="Course overview"
    accent="blue"
  />,
);
expect(screen.getByRole('heading', { level: 1, name: 'Mathematical Analysis' })).toBeInTheDocument();
expect(screen.getByText('Math I')).toBeInTheDocument();
expect(screen.getByTestId('cosmic-page-header')).toHaveAttribute('data-accent', 'blue');
```

- [ ] **Step 2: Verify RED**

```bash
npm test -- components/cosmic/CosmicPageHeader.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the shared header**

Use a restrained `cosmic-glass` panel with no raster image. Allow an `actions` slot and one subtle ambient gradient selected from a fixed accent map.

- [ ] **Step 4: Update one assertion in each view test before changing the view**

Examples:

```tsx
expect(screen.getByTestId('cosmic-page-header')).toHaveAttribute('data-accent', 'blue'); // CourseHub Math I
expect(screen.getByTestId('lesson-workspace')).toHaveClass('cosmic-reading-surface');
expect(screen.getByTestId('math-lab-shell')).toHaveClass('cosmic-instrument-panel');
expect(screen.getByTestId('practice-shell')).toHaveClass('cosmic-assessment-surface');
expect(screen.getByTestId('exams-shell')).toHaveClass('cosmic-assessment-surface');
expect(screen.getByTestId('progress-shell')).toHaveClass('cosmic-progress-surface');
expect(screen.getByTestId('formula-workspace')).toHaveClass('cosmic-notebook-surface');
expect(screen.getByTestId('assistant-shell')).toHaveClass('cosmic-console-surface');
```

Do not remove existing behavior assertions.

- [ ] **Step 5: Run affected tests and verify RED**

```bash
npm test -- views/CourseHubView.test.tsx views/LessonWorkspaceView.test.tsx views/MathLabView.test.tsx views/PracticeView.test.tsx views/ExamsView.test.tsx views/ProgressView.test.tsx views/FormulaWorkspaceView.test.tsx views/__tests__/AIChatView.test.tsx
```

Expected: FAIL only on missing visual-system test ids/classes.

- [ ] **Step 6: Apply the shared system without changing behavior**

- CourseHub: blue/violet header based on course id.
- Lesson: narrow reading column, glass stages, no hero image.
- Labs: instrument-panel wrapper; graphs/matrices remain dominant.
- Practice/Exams: neutral assessment wrapper and semantic feedback colors unchanged.
- Progress: shared rings/bars and course-separated surfaces.
- Formula Workspace: faint CSS notation texture, not a raster background.
- Assistant: console wrapper with chat contrast preserved.

- [ ] **Step 7: Verify all affected views**

```bash
npm test -- views/CourseHubView.test.tsx views/LessonWorkspaceView.test.tsx views/MathLabView.test.tsx views/PracticeView.test.tsx views/ExamsView.test.tsx views/ProgressView.test.tsx views/FormulaWorkspaceView.test.tsx views/__tests__/AIChatView.test.tsx
npm run typecheck
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add components/cosmic/CosmicPageHeader.tsx components/cosmic/CosmicPageHeader.test.tsx views
git commit -m "feat: extend cosmic system across learning views"
```

---

### Task 8: Responsive, Accessibility, and Motion Hardening

**Files:**
- Modify: `index.css`
- Modify: `components/cosmic/CosmicHero.test.tsx`
- Modify: `App.test.tsx`
- Modify: `scripts/tailwind-output.test.ts`

**Interfaces:**
- No new public component API.
- Desktop hero image remains right-aligned; mobile content stacks and image opacity is reduced.

- [ ] **Step 1: Add failing CSS-output assertions**

Extend `scripts/tailwind-output.test.ts` or add a focused PostCSS assertion for required custom selectors:

```ts
for (const selector of [
  '.cosmic-glass',
  '.cosmic-hero-fallback',
  '.cosmic-progress-ring',
  '.cosmic-assessment-surface',
]) {
  expect(result.css, `missing cosmic selector ${selector}`).toContain(selector);
}
expect(result.css).toContain('@media (prefers-reduced-motion: reduce)');
```

- [ ] **Step 2: Verify RED**

```bash
npm test -- scripts/tailwind-output.test.ts
```

Expected: FAIL for any selector not yet emitted.

- [ ] **Step 3: Complete responsive and accessibility CSS**

Add explicit rules:

```css
@media (max-width: 767px) {
  .cosmic-hero { min-height: 34rem; }
  .cosmic-hero__image { inset: auto -30% 0 10%; height: 52%; opacity: .48; }
  .cosmic-hero__content { max-width: none; }
}

@media (prefers-reduced-motion: reduce) {
  .cosmic-starfield,
  .ambient-light,
  .cosmic-card,
  .cosmic-hero__image { animation: none !important; transition: none !important; transform: none !important; }
}
```

Ensure focus-visible contrast is at least three pixels and no hover transform applies to users requesting reduced motion.

- [ ] **Step 4: Add semantic regression assertions**

```tsx
expect(screen.getAllByRole('main')).toHaveLength(1);
expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
```

In the hero test, assert the decorative image has `alt=""` and the content is still present when the image dispatches an error event.

- [ ] **Step 5: Run targeted and full verification**

```bash
npm test -- scripts/tailwind-output.test.ts components/cosmic/CosmicHero.test.tsx App.test.tsx
npm run verify
npm run build:pages
```

Expected: all tests, typecheck, domain scan, normal build, and Pages build pass.

- [ ] **Step 6: Commit**

```bash
git add index.css scripts/tailwind-output.test.ts components/cosmic/CosmicHero.test.tsx App.test.tsx
git commit -m "test: harden cosmic UI responsiveness and accessibility"
```

---

### Task 9: Final Visual Acceptance and GitHub Pages Deployment

**Files:**
- Modify only files required by issues found during acceptance.
- Do not add unrelated features or refactors.

**Interfaces:**
- Final site remains available at `https://inmerson.github.io/Math-CS/`.

- [ ] **Step 1: Run the complete quality gate from a clean install**

```bash
rm -rf node_modules dist site
npm ci --include=optional
npm run verify
npm run build:pages
```

Expected: success with no failed tests or TypeScript errors.

- [ ] **Step 2: Verify generated Pages paths and asset contents**

```bash
test -f site/index.html
test -f site/assets/cosmic/black-hole-hero.webp
grep -q '/Math-CS/assets/' site/index.html
grep -R -q 'cosmic-hero' site/assets/*.css
```

Expected: all commands succeed.

- [ ] **Step 3: Perform desktop acceptance at approximately 1536×864**

Check against the approved mockup:

```text
- Persistent black glass sidebar with branded ring mark
- Strong black-hole hero with left-side readable title
- Search field below the hero content
- Two distinct course cards: blue Math I, violet Math II
- Progress rings and recommendation rows visible
- Math Lab and Formula Workspace utility cards visible
- No fake account, notification, or shortcut behavior
```

- [ ] **Step 4: Perform mobile acceptance at approximately 390×844**

```text
- Mobile header and slide-out navigation work
- Bottom navigation remains usable
- Hero content is readable and image does not cover text
- Course and utility cards stack without horizontal overflow
- Tap targets remain at least 44 px tall
```

- [ ] **Step 5: Check image failure and reduced motion**

Temporarily block the hero image request in browser tools and confirm the gradient fallback preserves text contrast. Enable reduced motion and confirm star/card/hero drift stops.

- [ ] **Step 6: Commit any acceptance-only correction**

```bash
git add <only-the-files-corrected-during-acceptance>
git commit -m "fix: polish cosmic UI acceptance issues"
```

Skip this commit when no correction is needed.

- [ ] **Step 7: Merge and deploy after verification**

Merge the verified implementation branch into `main`. Confirm the CI workflow and `Publish GitHub Pages site` workflow both conclude `success`, then confirm the latest Pages build reports `built`.

- [ ] **Step 8: Verify the live site**

Open:

```text
https://inmerson.github.io/Math-CS/
```

Hard-refresh once and confirm the served CSS references the new cosmic selectors and the hero image loads from `/Math-CS/assets/cosmic/black-hole-hero.webp`.
