# Inmerson Math-CS Cosmic Black Hole UI Design

**Date:** 2026-08-06  
**Status:** Approved visual direction, pending written-spec review  
**Repository:** `Inmerson/Math-CS`  
**Reference:** The approved desktop mockup generated in this conversation, featuring a photorealistic black hole hero, dark glass panels, a persistent left sidebar, two course cards, and compact Math Lab / Formula Workspace cards.

## 1. Goal

Transform the existing Math-CS interface into a premium academic sci-fi product whose visual identity is built around a photorealistic three-dimensional black hole. The cosmic treatment must be strongest on the dashboard hero and subtle elsewhere so that lessons, exercises, formulas, and assessments remain calm, readable, and efficient.

The redesign is visual and structural only. Existing curriculum data, navigation destinations, local progress storage, quiz grading, laboratories, examinations, formulas, and assistant behavior must remain functionally unchanged.

## 2. Design Principles

1. **Cinematic first impression:** The dashboard hero presents the black hole as the dominant visual anchor.
2. **Academic clarity:** Content hierarchy and reading contrast take priority over decorative effects.
3. **Controlled depth:** Glass layers, restrained glow, and starfield depth establish atmosphere without visual noise.
4. **Two-course distinction:** Math I uses cool blue accents; Math II uses soft violet accents.
5. **Consistent product system:** Dashboard, course hubs, lessons, laboratories, practice, exams, progress, formulas, and assistant share the same tokens and panel language.
6. **Accessible motion:** Animation remains subtle and respects `prefers-reduced-motion`.

## 3. Visual System

### 3.1 Palette

- Page base: near-black `#030711`
- Deep navy surface: `#07111f`
- Raised surface: `#0b1726`
- Glass surface: translucent navy-black between 72% and 88% opacity
- Primary text: warm white `#f5f7fb`
- Secondary text: slate-blue `#9aa9bd`
- Math I accent: electric blue / cyan range
- Math II accent: violet / indigo range
- Black-hole accretion light: restrained warm white, pale gold, and soft copper
- Borders: low-opacity blue-white, with brighter active-state edges

### 3.2 Typography

- Use a clean sans-serif stack suitable for technical learning.
- Hero heading: large, confident, tight tracking.
- Section labels: small uppercase text with increased tracking.
- Body copy: comfortable line-height and muted contrast.
- Formula and code surfaces may retain monospace styling where already present.

### 3.3 Surfaces

Introduce reusable visual classes or components for:

- `cosmic-shell`: page-level dark spatial background
- `cosmic-glass`: translucent panel with blur, fine border, and restrained shadow
- `cosmic-card`: interactive elevated card
- `cosmic-divider`: faint luminous horizontal divider
- `cosmic-glow-blue` and `cosmic-glow-violet`: course-specific accent treatments
- `cosmic-button`: dark-to-accent gradient button with a subtle focus-visible halo

No panel should use excessive blur or glow. Text must remain legible against every image and gradient.

## 4. Asset Strategy

### 4.1 Black Hole Hero Asset

Create and store one optimized photorealistic black-hole image under a stable path such as:

`public/assets/cosmic/black-hole-hero.webp`

Requirements:

- Wide cinematic composition suitable for a desktop hero.
- Black-hole event horizon positioned toward the upper-right.
- Visible gravitational lensing and a realistic accretion disk.
- Darker negative space on the left for title and description.
- No embedded text, logo, watermark, interface, person, or device frame.
- Export WebP or AVIF with a practical balance between detail and transfer size.
- Provide a lower-resolution mobile variant only if responsive testing shows the desktop asset is too expensive.

The generated dashboard mockup is a visual reference, not an image to place directly as the entire interface background.

### 4.2 Supporting Visuals

Course cards use lightweight SVG/CSS illustrations rather than additional large raster images:

- Math I: luminous wireframe function surface or curve plot.
- Math II: luminous vector axes, matrix grid, or wireframe cube.
- Math Lab: compact orbital or nebula accent.
- Formula Workspace: faint integral, matrix, and eigenvalue notation texture.

These visuals are decorative and must use `aria-hidden="true"`.

## 5. Application Shell

### 5.1 Desktop

- Persistent left sidebar, approximately 272–288 px wide.
- Main content occupies the remaining viewport with a maximum readable width.
- Sidebar uses a nearly black translucent surface and a fine right border.
- Brand area includes a small black-hole-ring mark and the two-line name `Inmerson Math-CS`.
- Active navigation receives a blue-violet edge, subtle internal glow, and high-contrast text.
- Secondary tools remain visually integrated instead of appearing as an unrelated footer block.
- A compact overall-progress card sits near the bottom of the sidebar, using real progress derived from current state.

### 5.2 Mobile and Tablet

- Preserve the existing slide-out navigation and bottom navigation patterns.
- Hero becomes vertically stacked: text first, black-hole image second or behind a dark overlay.
- Course cards stack to one column.
- Utility cards stack or become horizontally scrollable only if width testing requires it.
- Decorative starfield and image layers reduce in complexity on small screens.

## 6. Dashboard

### 6.1 Hero

Replace the plain header with a cinematic hero panel.

Structure:

- Large `Inmerson Math-CS` title.
- Tagline `Interactive Mathematics for Computer Science`.
- Existing brand description.
- Thin luminous divider with a small light point.
- Photorealistic black-hole image on the right, blended into the surface with overlays and edge gradients.
- Optional compact notification/avatar controls are excluded from the initial implementation because no account or notification system exists.

The hero must remain readable when the image fails to load. A CSS gradient fallback is mandatory.

### 6.2 Search

- Place the existing learning search directly below or partially overlapping the hero’s lower edge.
- Use a dark glass field with a leading icon.
- Retain existing search behavior and result destinations.
- A visual keyboard-shortcut badge may be displayed, but it must not imply a shortcut unless the shortcut is actually implemented. The initial implementation should omit the badge unless keyboard handling is added and tested.

### 6.3 Course Cards

Both course cards share one component structure but use course-specific accents.

Each card contains:

- Course label and title.
- Official Polish title.
- Course description.
- Decorative course illustration.
- Horizontal progress bar.
- Compact circular percentage indicator.
- Completed-topic count.
- Recommended next topic.
- Latest checkpoint result.
- Strong course-specific call-to-action button.

Math I uses blue/cyan. Math II uses violet/indigo. The cards must not become visually identical except for text.

### 6.4 Utility Cards

Math Lab and Formula Workspace become wide compact cards below the courses.

- Large icon medallion on the left.
- Title and short description.
- Subtle domain-specific background visual.
- Compact action button on the right.
- Entire card remains keyboard accessible.

## 7. Internal Views

The strongest photorealistic black-hole image appears only on the dashboard. Other views inherit the cosmic system more quietly.

### Course Hub

- Course-specific blue or violet ambient gradient.
- A compact course header with progress and recommended next topic.
- Topic cards use glass surfaces and clear completion states.

### Lesson Workspace

- Reading-focused central column.
- Optional low-opacity starfield or grid only in page margins.
- Learn, Visualize, Practice, CS Connection, and Quiz stages have distinct but restrained panel accents.
- No large black-hole imagery behind lesson text.

### Labs

- Dark instrument-panel feel.
- Graphs, matrices, axes, inputs, and results remain the visual focus.
- Accent glow reflects the active lab rather than adding unrelated decorative imagery.

### Practice and Exams

- Calm, high-contrast assessment surfaces.
- Cosmic styling limited to headers, borders, buttons, and progress indicators.
- Correct/incorrect feedback colors remain semantically clear.

### Progress

- Use luminous rings, bars, and course-separated statistics.
- The sidebar overall-progress value and Progress view use the same derived percentage formula.

### Formula Workspace and Assistant

- Formula Workspace resembles a dark technical notebook with faint notation textures.
- Assistant uses a deep-space console tone without reducing chat readability.

## 8. Component Architecture

Create focused presentation components rather than placing the entire redesign in `DashboardView.tsx`.

Expected components:

- `components/cosmic/CosmicHero.tsx`
- `components/cosmic/CosmicLogoMark.tsx`
- `components/cosmic/CosmicProgressRing.tsx`
- `components/cosmic/CourseVisual.tsx`
- `components/cosmic/UtilityCard.tsx`
- Optional `components/cosmic/Starfield.tsx` if CSS-only background logic becomes too large for `AnimatedBackground.tsx`

Modify existing boundaries:

- `App.tsx`: shell spacing and mobile header styling only.
- `components/AnimatedBackground.tsx`: global subtle starfield and gradient layers.
- `components/Sidebar.tsx`: branded logo, active states, overall progress card; accept derived progress data through props rather than reading storage directly.
- `views/DashboardView.tsx`: compose hero, search, course grid, and utility cards.
- `components/course/CourseCard.tsx`: new premium card layout while retaining existing data and navigation props.
- `index.css`: design tokens, reusable surfaces, reduced-motion behavior, and safe image overlays.

Business logic and storage functions must not be moved into presentation components.

## 9. Data Flow

- `App.tsx` continues to own `MathCsState`.
- Derived overall progress is calculated through a pure utility function.
- `Sidebar` receives the overall percentage as a prop.
- `DashboardView` continues to receive state and navigation callbacks.
- `CourseCard` receives already-derived course progress, completion count, recommendation, and latest quiz.
- No new remote API, login, notification, analytics, or cloud persistence is introduced.

## 10. Motion

Allowed motion:

- Very slow background drift.
- Gentle hero-image scale or parallax limited to a few pixels.
- Card hover elevation and border glow.
- Progress animations when values change.
- Route-content fade/translate consistent with existing Framer Motion usage.

Disallowed motion:

- Fast star movement.
- Spinning black-hole animation that distracts from reading.
- Continuous large-scale parallax.
- Motion that hides initial content or causes layout shift.

All nonessential motion is disabled or reduced under `prefers-reduced-motion`.

## 11. Accessibility

- Maintain one page-level `main` landmark and logical heading order.
- All controls preserve visible keyboard focus.
- Text overlays meet WCAG AA contrast against the hero image.
- Decorative imagery uses empty alt text or `aria-hidden`.
- The hero black-hole image is decorative; the educational meaning is communicated in text.
- Progress rings expose a text value and accessible label.
- Hover effects have equivalent focus-visible states.
- Mobile navigation remains operable without pointer input.

## 12. Performance

- Lazy-load noncritical visual assets where practical.
- Hero image must use explicit dimensions or aspect ratio to prevent layout shift.
- Use responsive `srcset` only when multiple image variants are actually generated.
- Avoid video, WebGL, or real-time 3D rendering in this redesign.
- The visual target is photorealistic, but implementation uses an optimized raster hero plus CSS/SVG effects rather than a heavy 3D runtime.
- Preserve the existing GitHub Pages deployment path and base URL.

## 13. Testing and Acceptance Criteria

### Automated

- Existing behavior tests remain green.
- Add tests for overall-progress derivation.
- Add component tests for:
  - sidebar progress and active navigation;
  - dashboard hero title and accessible fallback structure;
  - Math I and Math II distinct accents/visual variants;
  - utility-card destinations;
  - progress ring accessible labeling.
- Keep the Tailwind production-output regression test passing.
- Run `npm run verify` and `npm run build:pages`.

### Visual and Responsive

Verify at minimum:

- 1440 px desktop.
- 1024 px tablet landscape.
- 768 px tablet portrait.
- 390 px mobile.

Acceptance conditions:

- Dashboard resembles the approved mockup in hierarchy, tone, spacing, and atmosphere.
- Black-hole visual is prominent on desktop but does not obscure title or search.
- Course cards are distinct and balanced.
- No horizontal overflow at target widths.
- Internal lesson and assessment views remain readable and calmer than the dashboard.
- Existing navigation, quizzes, laboratories, progress, formulas, and assistant remain functional.
- GitHub Pages deployment serves the redesigned assets correctly under `/Math-CS/`.

## 14. Non-Goals

- No account system, avatar profile, notifications, social features, or cloud sync.
- No WebGL black-hole simulation.
- No replacement of curriculum content.
- No new grading logic.
- No arbitrary animation library beyond existing dependencies.
- No redesign that sacrifices mobile usability or lesson readability for visual spectacle.
