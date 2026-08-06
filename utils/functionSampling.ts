export interface PlotPoint { x: number; y: number | null; approximation?: number | null; }
export interface FunctionParameter { id: string; label: string; value: number; min: number; max: number; step: number; }
export interface FunctionPreset {
  id: string;
  title: string;
  formula: string;
  interpretation: string;
  parameters: FunctionParameter[];
  domain: [number, number];
  sample: (x: number, parameters: Record<string, number>) => number;
  approximation?: (x: number, parameters: Record<string, number>) => number;
}

const presets: FunctionPreset[] = [
  { id: 'functions-graphs', title: 'Quadratic Graph', formula: 'f(x)=ax²+bx+c', interpretation: 'Coefficients control curvature, horizontal tendency, and vertical position.', parameters: [{ id: 'a', label: 'Quadratic coefficient a', value: 1, min: -3, max: 3, step: 0.25 }, { id: 'b', label: 'Linear coefficient b', value: 0, min: -5, max: 5, step: 0.5 }, { id: 'c', label: 'Constant c', value: 0, min: -5, max: 5, step: 0.5 }], domain: [-5, 5], sample: (x,p) => p.a*x*x+p.b*x+p.c },
  { id: 'sequences', title: 'Sequence Convergence', formula: 'aₙ=L+rⁿ', interpretation: 'When |r|<1, the terms approach L.', parameters: [{ id: 'L', label: 'Limit L', value: 1, min: -3, max: 3, step: 0.25 }, { id: 'r', label: 'Ratio r', value: 0.5, min: -0.9, max: 0.9, step: 0.1 }], domain: [0, 20], sample: (x,p) => p.L+Math.pow(p.r, Math.round(x)) },
  { id: 'limits', title: 'Removable Limit', formula: 'f(x)=(x²−1)/(x−1)', interpretation: 'The nearby values approach 2 while x=1 remains a gap.', parameters: [], domain: [-3, 5], sample: (x) => Math.abs(x-1)<0.03 ? Number.NaN : (x*x-1)/(x-1) },
  { id: 'continuity', title: 'Continuity Check', formula: 'f(x)=|x−a|', interpretation: 'The left and right values meet at the selected point.', parameters: [{ id: 'a', label: 'Reference point a', value: 0, min: -3, max: 3, step: 0.25 }], domain: [-5, 5], sample: (x,p) => Math.abs(x-p.a) },
  { id: 'derivatives', title: 'Tangent and Derivative', formula: 'f(x)=x², tangent at a', interpretation: 'The tangent slope equals 2a.', parameters: [{ id: 'a', label: 'Tangent point a', value: 1, min: -3, max: 3, step: 0.25 }], domain: [-4, 4], sample: (x) => x*x, approximation: (x,p) => p.a*p.a+2*p.a*(x-p.a) },
  { id: 'derivative-applications', title: 'Optimization', formula: 'f(x)=x²−4x+k', interpretation: 'The minimum stays at x=2 while k shifts the graph vertically.', parameters: [{ id: 'k', label: 'Vertical shift k', value: 0, min: -4, max: 4, step: 0.5 }], domain: [-1, 5], sample: (x,p) => x*x-4*x+p.k },
  { id: 'integrals', title: 'Accumulated Area', formula: 'f(x)=mx+b', interpretation: 'The shaded interval represents signed accumulation.', parameters: [{ id: 'm', label: 'Slope m', value: 1, min: -2, max: 2, step: 0.25 }, { id: 'b', label: 'Intercept b', value: 0, min: -3, max: 3, step: 0.25 }], domain: [-4, 4], sample: (x,p) => p.m*x+p.b },
  { id: 'taylor-series', title: 'Taylor Approximation', formula: 'eˣ≈1+x+x²/2', interpretation: 'The polynomial follows eˣ most closely near zero.', parameters: [], domain: [-2, 2], sample: (x) => Math.exp(x), approximation: (x) => 1+x+x*x/2 },
];

export const getFunctionPreset = (id?: string): FunctionPreset | undefined => presets.find((preset) => preset.id === id) ?? presets[0];
export const getFunctionPresets = (): readonly FunctionPreset[] => presets;
export const clampParameter = (parameter: FunctionParameter, value: number): number => Math.min(parameter.max, Math.max(parameter.min, Number.isFinite(value) ? value : parameter.value));
export const samplePreset = (preset: FunctionPreset, values: Record<string, number>, count = 121): PlotPoint[] => {
  const [start, end] = preset.domain;
  return Array.from({ length: count }, (_, index) => {
    const x = start + ((end-start)*index)/(count-1);
    const y = preset.sample(x, values);
    const approximation = preset.approximation?.(x, values);
    return { x, y: Number.isFinite(y) ? y : null, approximation: approximation === undefined ? undefined : Number.isFinite(approximation) ? approximation : null };
  });
};
