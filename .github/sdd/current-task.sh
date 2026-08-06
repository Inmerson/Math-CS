#!/usr/bin/env bash
set -euo pipefail

npm run verify
npm run build:pages
npm --prefix server ci --include=optional
npm --prefix server run build

python - <<'PY'
from pathlib import Path

root = Path('.')
hero = root / 'public/assets/cosmic/black-hole-hero.webp'
site = root / 'site'
index = site / 'index.html'

assert hero.is_file(), 'missing source hero asset'
assert hero.stat().st_size <= 900_000, 'hero asset exceeds transfer budget'
assert index.is_file(), 'missing generated Pages index'
html = index.read_text()
assert '/Math-CS/assets/' in html, 'Pages base path missing from generated index'
assert (site / 'assets/cosmic/black-hole-hero.webp').is_file(), 'hero asset not copied into Pages output'

css_files = list((site / 'assets').glob('*.css'))
js_files = list((site / 'assets').glob('*.js'))
assert css_files, 'generated CSS bundle missing'
assert js_files, 'generated JS bundle missing'
css = '\n'.join(path.read_text(errors='ignore') for path in css_files)
js = '\n'.join(path.read_text(errors='ignore') for path in js_files)
for selector in ['.cosmic-glass', '.cosmic-hero', '.cosmic-progress-ring', '.cosmic-mobile-safe-area']:
    assert selector in css, f'missing production selector {selector}'
assert 'assets/cosmic/black-hole-hero.webp' in js, 'runtime hero asset reference missing'

references = {
    str(path): 'black-hole-hero' in path.read_text(errors='ignore')
    for path in list((root / 'components').rglob('*.tsx')) + list((root / 'views').rglob('*.tsx'))
}
actual = {path for path, contains in references.items() if contains}
expected = {
    'components/cosmic/CosmicHero.tsx',
    'components/cosmic/CosmicHero.test.tsx',
}
assert actual == expected, f'photorealistic asset leaked outside dashboard hero: {sorted(actual)}'
PY

mkdir -p docs/superpowers/reports
cat > docs/superpowers/reports/2026-08-06-cosmic-black-hole-ui-verification.md <<EOF
# Cosmic Black Hole UI Verification

**Date:** 2026-08-06  
**Branch:** \`design/cosmic-black-hole-ui\`  
**Verified source head:** \`$(git rev-parse HEAD)\`

## Fresh verification commands

- \`npm run verify\` — typecheck, complete Vitest suite, domain-clean scan, and production build.
- \`npm run build:pages\` — GitHub Pages build using \`/Math-CS/\` base path.
- \`npm --prefix server ci --include=optional\` and \`npm --prefix server run build\` — optional API dependency and TypeScript build validation.
- Generated-site assertions — Pages asset paths, hero copy, cosmic CSS selectors, runtime hero reference, transfer budget, and dashboard-only photorealistic-asset usage.

## Acceptance mapping

- Cinematic photorealistic black-hole hero is isolated to \`CosmicHero\`.
- Dashboard retains search, two courses, Math Lab, and Formula Workspace navigation.
- Math I and Math II have stable blue and violet identities.
- Internal reading, labs, assessment, progress, formula, and assistant views use restrained cosmic surfaces.
- Mobile layout includes safe-area padding, 44 px coarse-pointer targets, compact navigation, and stacked hero treatment.
- Image failure and reduced-motion modes retain readable educational content.
- No account, notification, analytics, cloud persistence, arbitrary expression execution, or new WebGL dependency was added.
EOF
