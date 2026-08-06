# Cosmic Black Hole UI Plan Self-Review Notes

**Date:** 2026-08-06  
**Applies to:** `docs/superpowers/plans/2026-08-06-cosmic-black-hole-ui.md`  
**Status:** Normative corrections; execution must read these notes together with the plan.

## Review result

- **Spec coverage:** Complete. Asset strategy, visual tokens, application shell, dashboard, course distinction, internal views, responsive behavior, accessibility, motion, tests, Pages build, and live deployment each map to a numbered task.
- **Placeholder scan:** No `TBD`, `TODO`, `implement later`, `fill in details`, or “similar to Task N” placeholders are present.
- **Scope:** One coherent visual-system redesign; no independent backend or account subsystem is included.
- **Type and path consistency:** Three corrections below are binding.

## Binding corrections

### 1. GitHub Pages-aware hero path

Where Task 1 or Task 5 describes the browser path as `/assets/cosmic/black-hole-hero.webp`, interpret the repository path as fixed but construct the runtime URL with Vite’s base:

```ts
const heroSrc = `${import.meta.env.BASE_URL}assets/cosmic/black-hole-hero.webp`;
```

This yields `/assets/cosmic/black-hole-hero.webp` during ordinary local/test builds and `/Math-CS/assets/cosmic/black-hole-hero.webp` in the Pages build.

### 2. Decorative image test semantics

An `<img alt="">` is decorative and Testing Library may expose it as `presentation`, not as role `img`. Replace the Task 5 test query:

```tsx
screen.getByRole('img', { name: '' })
```

with a stable decorative-image test id:

```tsx
const image = screen.getByTestId('black-hole-image');
expect(image).toHaveAttribute('alt', '');
expect(image).toHaveAttribute('src', expect.stringContaining('assets/cosmic/black-hole-hero.webp'));
```

`CosmicHero` must render `data-testid="black-hole-image"` on that image.

### 3. Storage key used by the App test

`utils/mathCsStorage.ts` exports `MATH_CS_STORAGE_PREFIX`, while its complete state key is intentionally private. Replace the Task 4 test reference to the nonexistent `MATH_CS_STORAGE_KEY` with:

```tsx
import { MATH_CS_STORAGE_PREFIX } from './utils/mathCsStorage';

localStorage.setItem(`${MATH_CS_STORAGE_PREFIX}state`, JSON.stringify(seeded));
```

No new production export is required.
