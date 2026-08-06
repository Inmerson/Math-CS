import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const roots = [
  'App.tsx', 'components', 'data', 'domain', 'services', 'utils', 'views',
  'android', 'server', 'index.html', 'index.tsx', 'manifest.json',
  'metadata.json', 'README.md', 'capacitor.config.ts', 'render.yaml', 'site',
];
const textExtensions = new Set(['.ts','.tsx','.js','.jsx','.mjs','.json','.md','.html','.xml','.gradle','.yaml','.yml','.properties']);
const forbidden = [
  ['bio','tech'].join(''),
  ['bio','technology'].join(''),
  ['bio','logy'].join(''),
  ['d','n','a'].join(''),
  ['population','model'].join(' '),
  ['radioactive','decay'].join(' '),
  ['differential','equation'].join(' '),
  ['math','biotech'].join('-'),
  ['s','g','g','w'].join(''),
  ['Warsaw University','of Life Sciences'].join(' '),
].map((value) => new RegExp(value, 'i'));
const matches=[];

async function inspect(path) {
  let info;
  try { info=await stat(path); } catch { return; }
  if (info.isDirectory()) {
    for (const entry of await readdir(path)) {
      if (['node_modules','dist','.git'].includes(entry)) continue;
      await inspect(join(path,entry));
    }
    return;
  }
  const relativePath=relative(root,path);
  if (relativePath.includes('/__tests__/') || /\.test\.[^.]+$/.test(relativePath)) return;
  if (!textExtensions.has(extname(path)) && path.split('/').at(-1) !== 'Dockerfile') return;
  const content=await readFile(path,'utf8');
  content.split(/\r?\n/).forEach((line,index) => {
    if (forbidden.some((pattern) => pattern.test(line))) matches.push(`${relativePath}:${index+1}: ${line.trim()}`);
  });
}

for (const item of roots) await inspect(join(root,item));
if (matches.length) {
  console.error('Learner-facing legacy-domain references remain:\n'+matches.join('\n'));
  process.exit(1);
}
console.log('Math-CS learner-facing domain scan passed.');
