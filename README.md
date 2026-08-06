# Inmerson • Personal Math & Biotech Lab

A personal mathematics and biotechnology learning laboratory by Inmerson, designed to be published as a responsive web app, an installable PWA and native mobile packages from one shared codebase.

The project combines interactive mathematical learning, biotechnology-oriented examples, three-dimensional visualizations and a REST API for deterministic calculations and study records.

## Project status

**Active development — public transition repository**

The source is publicly visible, but a final open-source license has not yet been selected. Until a `LICENSE` file is added, public visibility alone does not grant general reuse rights.

## Current capabilities

- Biotechnology-oriented mathematical lessons and examples
- Matrix addition, multiplication, determinant and inverse workflows
- Exam-performance tracking and statistics
- Formula rendering with KaTeX
- Interactive 3D content through Three.js
- AI-assisted explanations
- Installable PWA support
- Android packaging through Capacitor
- REST API for calculations and study integrations

## Technology

### Client

- React 19 and TypeScript
- Vite and Tailwind CSS
- Math.js and KaTeX
- Three.js, React Three Fiber and Drei
- Framer Motion
- Vite PWA
- Capacitor for Android
- Vitest and Testing Library

### Backend

- Node.js and Express
- TypeScript
- Environment-based server configuration

## Architecture

```text
Web / PWA / Capacitor mobile client
                 │
                 ▼
          Versioned REST API
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
Deterministic math     Study records and
operations             controlled AI gateway
```

The web, PWA and mobile builds should share the same course logic. Platform-specific capabilities belong behind explicit adapters rather than in separate copies of the application.

## Web development

Install dependencies and start the client:

```bash
npm install
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Backend development

```bash
cd server
npm install
npm run dev
```

The development API is available by default at:

```text
http://localhost:5000
```

Build and start the compiled backend:

```bash
npm run build
npm start
```

Backend details are available in [`server/README.md`](server/README.md).

## Mobile development

The repository contains Capacitor Android support. After a successful web build, synchronize the native project and open it in Android Studio:

```bash
npm run build
npx cap sync android
npx cap open android
```

Native releases should be generated from tagged commits through CI. Downloadable APK files should include release notes and checksums.

## AI security transition

The current AI interface includes a bring-your-own-key browser flow. Browser-persisted API keys are not an acceptable production design and must be removed before an official hosted release.

The target design is an authenticated backend AI gateway with:

- No provider credential in the web or mobile bundle
- No API key stored in `localStorage`
- Per-user authorization
- Input-size and rate limits
- Usage quotas and cost monitoring
- Provider timeout handling
- Explicit response schemas
- Safe Markdown rendering
- Minimal logs that exclude private learning content

AI explanations must remain secondary to deterministic mathematical verification.

## Testing priorities

- Matrix and numerical calculations
- Invalid and boundary inputs
- Formula parsing and rendering
- Exam scoring and progress calculations
- API request validation
- AI response-schema handling
- Consistency between web and mobile builds

Run the existing client tests with:

```bash
npx vitest run
```

Run the current backend API check from `server/`:

```bash
npm test
```

## Open-source release requirements

Before declaring the project fully open source:

- [ ] Select and add an open-source license.
- [ ] Audit the current tree and full Git history for credentials and private files.
- [ ] Remove browser-persisted API-key handling.
- [ ] Route production AI calls through the backend.
- [ ] Consolidate the roles of `Math-Biotech-App` and `Math-Biotech-Project`.
- [ ] Add CI for tests, builds, dependency review and secret scanning.
- [ ] Add `CONTRIBUTING.md`, `SECURITY.md` and a code of conduct.
- [ ] Document the license and source of course content and visual assets.
- [ ] Publish reproducible web and Android release procedures.
- [ ] Add privacy, export and account-deletion documentation where user data is stored.

The shared strategy for Math, Botany and Organic Chemistry is documented in the private Inmerse workspace roadmap.

## Scientific and educational responsibility

Mathematical results and AI-generated explanations should be independently checked before academic, laboratory, clinical or professional use. Simplified models should be identified as models rather than complete representations of living systems.

## Author

Developed by [Halil Ibrahim Ozturk](https://github.com/Inmerson).
