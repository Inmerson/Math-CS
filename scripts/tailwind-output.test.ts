import { readFile } from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import { describe, expect, it } from 'vitest';

describe('Tailwind production stylesheet', () => {
  it('emits theme-backed utilities used by the notebook layout', async () => {
    const sourcePath = path.resolve('index.css');
    const source = await readFile(sourcePath, 'utf8');
    const result = await postcss([tailwindcss()]).process(source, { from: sourcePath });

    const requiredUtilities = [
      ['p', '6'],
      ['gap', '6'],
      ['text', '3xl'],
      ['rounded', '2xl'],
      ['bg', 'slate', '950'],
    ].map((parts) => `.${parts.join('-')}`);

    for (const utility of requiredUtilities) {
      expect(result.css, `missing generated utility ${utility}`).toContain(utility);
    }
  });
});
