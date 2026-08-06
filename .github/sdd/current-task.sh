#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/assets/cosmic
base64 -d public/assets/cosmic/black-hole-hero.webp.base64 > public/assets/cosmic/black-hole-hero.webp
rm public/assets/cosmic/black-hole-hero.webp.base64
npm test -- scripts/cosmic-assets.test.ts
npm run verify
npm run build:pages
