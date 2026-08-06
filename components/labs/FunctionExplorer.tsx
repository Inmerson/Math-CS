import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { clampParameter, getFunctionPreset, samplePreset } from '../../utils/functionSampling';

interface FunctionExplorerProps { presetId?: string; }
const pathFor = (points: { x: number; y: number | null }[], width: number, height: number) => {
  const finite = points.filter((p): p is { x: number; y: number } => p.y !== null);
  if (!finite.length) return '';
  const minX = Math.min(...points.map((p) => p.x)); const maxX = Math.max(...points.map((p) => p.x));
  const ys = finite.map((p) => p.y); const minY = Math.min(...ys, -1); const maxY = Math.max(...ys, 1); const rangeY = maxY-minY || 1;
  let drawing = '';
  for (const point of points) { if (point.y === null) { drawing += ' '; continue; } const sx = ((point.x-minX)/(maxX-minX))*width; const sy = height-((point.y-minY)/rangeY)*height; drawing += `${drawing.trim().endsWith('Z') || !drawing.trim() ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)} `; }
  return drawing;
};
export const FunctionExplorer: React.FC<FunctionExplorerProps> = ({ presetId }) => {
  const preset = getFunctionPreset(presetId); if (!preset) return <div role="alert">Unsupported function preset</div>;
  const defaults = Object.fromEntries(preset.parameters.map((p) => [p.id, p.value]));
  const [values, setValues] = useState<Record<string, number>>(defaults);
  React.useEffect(() => setValues(defaults), [preset.id]);
  const points = useMemo(() => samplePreset(preset, values), [preset, values]);
  const primaryPath = pathFor(points, 720, 340); const approximationPath = pathFor(points.map((p) => ({ x: p.x, y: p.approximation ?? null })), 720, 340);
  return <section className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]"><div className="notebook-panel p-5"><h2 className="text-xl font-bold text-white">{preset.title}</h2><p className="formula-panel mt-4 font-mono text-cyan-100">{preset.formula}</p><div className="mt-5 space-y-5">{preset.parameters.map((parameter) => <label key={parameter.id} className="block text-sm text-slate-300">{parameter.label}<span className="float-right font-mono text-cyan-200">{values[parameter.id]}</span><input aria-label={parameter.label} className="mt-2 w-full accent-cyan-300" type="range" min={parameter.min} max={parameter.max} step={parameter.step} value={values[parameter.id]} onChange={(event) => setValues((current) => ({ ...current, [parameter.id]: clampParameter(parameter, Number(event.target.value)) }))} /></label>)}</div><button className="focus-ring mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm" onClick={() => setValues(defaults)}><RotateCcw size={15} />Reset</button></div><div className="notebook-panel p-4"><svg viewBox="0 0 720 340" className="h-auto w-full" role="img" aria-label={`${preset.title} graph`}><rect width="720" height="340" fill="#07111f" /><path d="M0 170 H720 M360 0 V340" stroke="rgba(148,163,184,.25)" /><path d={primaryPath} fill="none" stroke="currentColor" className="text-cyan-300" strokeWidth="3" /><path d={approximationPath} fill="none" stroke="currentColor" className="text-amber-300" strokeWidth="2" strokeDasharray="8 6" /></svg><p className="mt-4 leading-7 text-slate-300" aria-live="polite">{preset.interpretation}</p><p className="mt-2 text-xs text-slate-500">Cyan: function. Amber dashed: supported approximation or tangent.</p></div></section>;
};
