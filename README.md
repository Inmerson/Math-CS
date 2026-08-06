# Inmerson Math-CS

**Interactive Mathematics for Computer Science**

Inmerson Math-CS is a Computational Notebook-style learning workspace for the first two mathematics courses in the PJATK Computer Science sequence:

- **Math I — Mathematical Analysis / Analiza matematyczna:** functions, sequences, limits, continuity, derivatives, applications of derivatives, integrals, and Taylor polynomials and series.
- **Math II — Linear Algebra & Geometry / Algebra liniowa i geometria:** vectors, matrices, linear systems, determinants, inverses, vector spaces, linear transformations, eigenvalues and eigenvectors, and analytic geometry in two and three dimensions.

## Learning experience

Each topic follows **Learn → Visualize → Practice → CS Connection → Quiz**. Function Explorer, Matrix Lab, and Vector & Geometry Lab use bounded curriculum presets and deterministic calculations. Progress, quiz results, saved formulas, and notes remain local to the device under versioned `math-cs:v1:` storage keys.

## Development

```bash
npm ci --include=optional
npm run dev
```

Run the complete quality gate:

```bash
npm run verify
```

Build the GitHub Pages output under `site/`:

```bash
npm run build:pages
```

The application uses React, TypeScript, Vite, Vitest, Testing Library, Tailwind CSS, Framer Motion, KaTeX, Lucide, and Capacitor.
