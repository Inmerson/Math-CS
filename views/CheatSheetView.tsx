

import React from 'react';
import { ModuleType } from '../types';
import { motion } from 'framer-motion';
import { FileText, Sigma, Divide, TrendingUp, Activity, Grid3X3, Infinity, Calculator, PenTool, Braces, AreaChart, Layers } from 'lucide-react';
import { MathRenderer } from '../components/MathRenderer';

interface CheatSheetSection {
  title: string;
  items: {
    label: string;
    formula: string;
    note?: string;
  }[];
}

export const CheatSheetView: React.FC<{ module: ModuleType }> = ({ module }) => {
  
  const getModuleData = (): { color: string; icon: any; sections: CheatSheetSection[] } => {
    switch (module) {
      case ModuleType.MATRIX:
        return {
          color: 'text-orange-400',
          icon: Grid3X3,
          sections: [
            {
              title: 'Basic Definitions',
              items: [
                { label: 'Matrix Dimensions', formula: 'A_{m \\times n}', note: 'm rows, n columns' },
                { label: 'Square Matrix', formula: 'm = n', note: 'Essential for det(A) & A⁻¹' },
                { label: 'Identity Matrix (I)', formula: 'I = \\text{diag}(1,1,\\dots,1)', note: 'A \\cdot I = A' },
                { label: 'Zero Matrix (0)', formula: 'O_{ij} = 0', note: 'A + O = A' },
                { label: 'Transpose', formula: '(A^T)_{ij} = A_{ji}', note: 'Rows become columns' },
                { label: 'Symmetric Matrix', formula: 'A = A^T', note: 'Must be square' },
                { label: 'Skew-Symmetric', formula: 'A^T = -A', note: 'Diag elements must be 0' }
              ]
            },
            {
              title: 'Operations',
              items: [
                { label: 'Addition', formula: 'C_{ij} = a_{ij} + b_{ij}', note: 'Dims must match exactly' },
                { label: 'Scalar Mult', formula: '(kA)_{ij} = k \\cdot a_{ij}', note: 'Multiply every element' },
                { label: 'Matrix Mult', formula: 'C_{ij} = \\sum_k a_{ik}b_{kj}', note: 'Cols(A) must equal Rows(B)' },
                { label: 'Properties', formula: 'AB \\neq BA', note: 'Generally not commutative' },
                { label: 'Transpose Prop', formula: '(AB)^T = B^T A^T', note: 'Order reverses!' },
                { label: 'Trace', formula: '\\text{Tr}(A) = \\sum a_{ii}', note: 'Sum of main diagonal' }
              ]
            },
            {
              title: 'Determinants (Det)',
              items: [
                { label: '2x2 Formula', formula: 'ad - bc', note: 'For [[a,b],[c,d]]' },
                { label: 'Sarrus Rule (3x3)', formula: '\\text{diag sum} - \\text{anti-diag sum}', note: 'Only for 3x3 matrices' },
                { label: 'Laplace Expansion', formula: '\\det A = \\sum (-1)^{i+j} a_{ij} M_{ij}', note: 'Expansion by any row/col' },
                { label: 'Product Rule', formula: '\\det(AB) = \\det(A)\\det(B)', note: '' },
                { label: 'Transpose Rule', formula: '\\det(A^T) = \\det(A)', note: '' },
                { label: 'Inverse Rule', formula: '\\det(A^{-1}) = 1/\\det(A)', note: '' },
                { label: 'Scalar Rule', formula: '\\det(kA) = k^n \\det(A)', note: 'n is dimension size' }
              ]
            },
            {
              title: 'Inverse Matrix',
              items: [
                { label: 'Condition', formula: '\\det(A) \\neq 0', note: 'Matrix is Non-Singular' },
                { label: 'Adjugate Formula', formula: 'A^{-1} = \\frac{1}{\\det A} (C_{ij})^T', note: 'Transpose of cofactor matrix' },
                { label: '2x2 Shortcut', formula: '\\frac{1}{ad-bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}', note: 'Swap diag, negate off-diag' },
                { label: 'Product Inverse', formula: '(AB)^{-1} = B^{-1}A^{-1}', note: 'Order reverses!' }
              ]
            },
            {
              title: 'Systems of Equations',
              items: [
                { label: 'Matrix Form', formula: 'AX = B', note: '' },
                { label: 'Cramer\'s Rule', formula: 'x_i = \\frac{\\det(A_i)}{\\det(A)}', note: 'Valid if det(A) ≠ 0' },
                { label: 'Rouche-Capelli', formula: '\\text{rank}(A) = \\text{rank}(A|B)', note: 'Condition for consistency' },
                { label: 'Unique Solution', formula: '\\text{rank}(A) = \\text{rank}(A|B) = n', note: 'n = variables' },
                { label: 'Infinite Solutions', formula: '\\text{rank}(A) = \\text{rank}(A|B) < n', note: 'Free parameters exist' }
              ]
            }
          ]
        };
      case ModuleType.SEQUENCES:
        return {
          color: 'text-amber-400',
          icon: TrendingUp,
          sections: [
            {
              title: 'Definitions',
              items: [
                { label: 'General Term', formula: 'a_n = f(n)', note: 'n ∈ ℕ' },
                { label: 'Monotonicity', formula: 'a_{n+1} - a_n', note: '>0 increasing, <0 decreasing' },
                { label: 'Convergence', formula: '\\lim_{n\\to\\infty} a_n = g', note: 'g is finite number' },
                { label: 'Boundedness', formula: '|a_n| \\le M', note: 'For all n' }
              ]
            },
            {
              title: 'Arithmetic Progression',
              items: [
                { label: 'Definition', formula: 'a_{n+1} - a_n = r', note: 'r is const difference' },
                { label: 'N-th Term', formula: 'a_n = a_1 + (n-1)r', note: '' },
                { label: 'Sum S_n', formula: '\\frac{a_1 + a_n}{2} \\cdot n', note: '' },
                { label: 'Monotonicity', formula: 'r > 0 \\implies \\nearrow', note: 'r < 0 implies decreasing' }
              ]
            },
            {
              title: 'Geometric Progression',
              items: [
                { label: 'Definition', formula: 'a_{n+1} / a_n = q', note: 'q is const ratio' },
                { label: 'N-th Term', formula: 'a_n = a_1 \\cdot q^{n-1}', note: '' },
                { label: 'Sum S_n (q≠1)', formula: 'a_1 \\frac{1-q^n}{1-q}', note: '' },
                { label: 'Infinite Sum', formula: 'S = \\frac{a_1}{1-q}', note: 'Converges if |q| < 1' }
              ]
            },
            {
              title: 'Key Limits',
              items: [
                { label: 'Reciprocal', formula: '\\lim \\frac{1}{n} = 0', note: '' },
                { label: 'Polynomials', formula: '\\lim \\frac{P(n)}{Q(n)}', note: 'Compare highest degrees' },
                { label: 'Euler Number', formula: '\\lim (1 + \\frac{1}{n})^n = e', note: '' },
                { label: 'Root Test', formula: '\\lim \\sqrt[n]{n} = 1', note: '' },
                { label: 'Constant Root', formula: '\\lim \\sqrt[n]{A} = 1', note: 'For A > 0' },
                { label: 'Geometric', formula: '\\lim q^n = 0', note: 'If |q| < 1' }
              ]
            },
            {
              title: 'Theorems',
              items: [
                { label: 'Squeeze Theorem', formula: 'a_n \\le b_n \\le c_n', note: 'If lim a = lim c, then lim b is same' },
                { label: 'Weierstrass', formula: 'Bounded & Monotonic', note: 'Implies Convergence' },
                { label: 'Arithmetic Ops', formula: '\\lim(a_n \\pm b_n) = A \\pm B', note: 'Only for finite limits' }
              ]
            }
          ]
        };
      case ModuleType.FUNCTIONS:
        return {
          color: 'text-rose-400',
          icon: Activity,
          sections: [
            {
              title: 'Function Basics',
              items: [
                { label: 'Domain (D)', formula: 'x \\text{ values}', note: 'Where f(x) exists' },
                { label: 'Range (R)', formula: 'y \\text{ values}', note: 'Output set' },
                { label: 'Roots', formula: 'f(x) = 0', note: 'x-intercepts' },
                { label: 'Injection (1-to-1)', formula: 'f(x_1)=f(x_2) \\implies x_1=x_2', note: 'Horizontal line test' },
                { label: 'Inverse', formula: 'y=f(x) \\iff x=f^{-1}(y)', note: 'Requires Injection' }
              ]
            },
            {
              title: 'Domain Constraints',
              items: [
                { label: 'Denominator', formula: '\\text{denom} \\neq 0', note: 'Division by zero' },
                { label: 'Even Roots', formula: '\\text{inside} \\ge 0', note: 'sqrt(x), x^(1/4)' },
                { label: 'Logarithms', formula: '\\text{argument} > 0', note: 'ln(x)' },
                { label: 'Arcsin/Arccos', formula: '-1 \\le x \\le 1', note: 'Domain restricted' }
              ]
            },
            {
              title: 'Parity & Symmetry',
              items: [
                { label: 'Even Function', formula: 'f(-x) = f(x)', note: 'Symmetric to Y-axis (e.g., x², cos x)' },
                { label: 'Odd Function', formula: 'f(-x) = -f(x)', note: 'Symmetric to Origin (e.g., x³, sin x)' },
                { label: 'Periodic', formula: 'f(x+T) = f(x)', note: 'Trig functions' }
              ]
            },
            {
              title: 'Elementary Functions',
              items: [
                { label: 'Linear', formula: 'y = ax+b', note: 'Slope a, intercept b' },
                { label: 'Quadratic', formula: 'y = ax^2+bx+c', note: 'Vertex x = -b/2a' },
                { label: 'Exponential', formula: 'y = a^x', note: 'Always > 0 (if a>0)' },
                { label: 'Logarithm', formula: 'y = \\log_a x', note: 'Inverse of exp' }
              ]
            },
            {
              title: 'Trigonometry',
              items: [
                { label: 'Pythagorean', formula: '\\sin^2 x + \\cos^2 x = 1', note: '' },
                { label: 'Double Angle (sin)', formula: '\\sin 2x = 2\\sin x \\cos x', note: '' },
                { label: 'Double Angle (cos)', formula: '\\cos 2x = \\cos^2 x - \\sin^2 x', note: '' }
              ]
            }
          ]
        };
      case ModuleType.LIMITS:
        return {
          color: 'text-pink-400',
          icon: Infinity,
          sections: [
            {
              title: 'Rules of Calculation',
              items: [
                { label: 'Const Mult', formula: '\\lim k f(x) = k \\lim f(x)', note: '' },
                { label: 'Sum/Diff', formula: '\\lim (f \\pm g) = \\lim f \\pm \\lim g', note: '' },
                { label: 'Product', formula: '\\lim (f \\cdot g) = \\lim f \\cdot \\lim g', note: '' },
                { label: 'Quotient', formula: '\\lim (f/g) = (\\lim f)/(\\lim g)', note: 'If lim g ≠ 0' },
                { label: 'Power', formula: '\\lim f(x)^{g(x)} = (\\lim f)^{\\lim g}', note: '' }
              ]
            },
            {
              title: 'Important Limits',
              items: [
                { label: 'Sinc Limit', formula: '\\lim_{x\\to 0} \\frac{\\sin x}{x} = 1', note: 'Very common' },
                { label: 'Euler Limit', formula: '\\lim_{x\\to 0} (1+x)^{1/x} = e', note: '' },
                { label: 'Log Growth', formula: '\\lim_{x\\to 0} \\frac{\\ln(1+x)}{x} = 1', note: '' },
                { label: 'Exp Growth', formula: '\\lim_{x\\to 0} \\frac{e^x - 1}{x} = 1', note: '' },
                { label: 'Infinity Ratio', formula: '\\frac{x^n}{e^x} \\to 0', note: 'As x → ∞' }
              ]
            },
            {
              title: 'Continuity & Asymptotes',
              items: [
                { label: 'Continuity Def', formula: '\\lim_{x\\to c} f(x) = f(c)', note: 'No holes, no jumps' },
                { label: 'Vertical Asym', formula: '\\lim_{x\\to c} f(x) = \\pm \\infty', note: 'Line x = c' },
                { label: 'Horizontal Asym', formula: '\\lim_{x\\to \\infty} f(x) = L', note: 'Line y = L' },
                { label: 'Oblique Asym', formula: 'y = ax+b', note: 'a = lim f(x)/x' }
              ]
            },
            {
              title: 'Indeterminate Forms',
              items: [
                { label: 'Types', formula: '\\frac{0}{0}, \\frac{\\infty}{\\infty}, 0 \\cdot \\infty, \\infty - \\infty', note: 'Requires work' },
                { label: 'Exponential', formula: '1^\\infty, \\infty^0, 0^0', note: 'Use ln() transform' },
                { label: 'Strategy', formula: 'Factor, Conjugate, L\'Hospital', note: '' }
              ]
            }
          ]
        };
      case ModuleType.DERIVATIVES:
        return {
          color: 'text-cyan-400',
          icon: Divide,
          sections: [
            {
              title: 'Definition',
              items: [
                { label: 'Limit Def', formula: 'f\'(x) = \\lim_{h\\to 0} \\frac{f(x+h)-f(x)}{h}', note: '' },
                { label: 'Tangent Slope', formula: 'm = f\'(x_0)', note: '' },
                { label: 'Tangent Line', formula: 'y - y_0 = f\'(x_0)(x - x_0)', note: '' },
                { label: 'Normal Line', formula: 'y - y_0 = -\\frac{1}{f\'(x_0)}(x - x_0)', note: 'Perpendicular' }
              ]
            },
            {
              title: 'Differentiation Rules',
              items: [
                { label: 'Power Rule', formula: '(x^n)\' = nx^{n-1}', note: '' },
                { label: 'Product Rule', formula: '(uv)\' = u\'v + uv\'', note: '' },
                { label: 'Quotient Rule', formula: '(\\frac{u}{v})\' = \\frac{u\'v - uv\'}{v^2}', note: '' },
                { label: 'Chain Rule', formula: '(f(g(x)))\' = f\'(g) \\cdot g\'(x)', note: 'Outer\' · Inner\'' },
                { label: 'Inverse Func', formula: '(f^{-1})\'(y) = \\frac{1}{f\'(x)}', note: '' }
              ]
            },
            {
              title: 'Standard Derivatives',
              items: [
                { label: 'Trig', formula: '(\\sin)\'=\\cos, (\\cos)\'=-\\sin', note: '' },
                { label: 'Tan/Cot', formula: '(\\tan)\'=\\frac{1}{\\cos^2}, (\\cot)\'=\\frac{-1}{\\sin^2}', note: '' },
                { label: 'Exponentials', formula: '(e^x)\' = e^x, (a^x)\' = a^x \\ln a', note: '' },
                { label: 'Logarithms', formula: '(\\ln x)\' = \\frac{1}{x}, (\\log_a x)\' = \\frac{1}{x \\ln a}', note: '' },
                { label: 'Inverse Trig', formula: '(\\arctan x)\' = \\frac{1}{1+x^2}', note: '' },
                { label: 'Arcsin', formula: '(\\arcsin x)\' = \\frac{1}{\\sqrt{1-x^2}}', note: '' }
              ]
            },
            {
              title: 'Applications (Analysis)',
              items: [
                { label: 'Monotonicity', formula: 'f\' > 0 \\implies \\nearrow', note: 'f\' < 0 implies decreasing' },
                { label: 'Extrema', formula: 'f\'(c)=0 \\text{ & sign change}', note: 'Local Max/Min' },
                { label: 'Convexity', formula: 'f\'\' > 0 \\implies \\cup', note: 'Concave Up (Convex)' },
                { label: 'Concavity', formula: 'f\'\' < 0 \\implies \\cap', note: 'Concave Down' },
                { label: 'Inflection Pt', formula: 'f\'\'(c)=0 \\text{ & sign change}', note: 'Change in curvature' },
                { label: 'L\'Hospital', formula: '\\lim \\frac{f}{g} = \\lim \\frac{f\'}{g\'}', note: 'For 0/0 or ∞/∞' }
              ]
            }
          ]
        };
      case ModuleType.INTEGRALS:
        return {
            color: 'text-emerald-400',
            icon: AreaChart,
            sections: [
                {
                    title: 'Indefinite Integrals',
                    items: [
                        { label: 'Power Rule', formula: '\\int x^a dx = \\frac{x^{a+1}}{a+1} + C', note: 'a ≠ -1' },
                        { label: 'Log Rule', formula: '\\int \\frac{1}{x} dx = \\ln|x| + C', note: '' },
                        { label: 'Exponential', formula: '\\int e^x dx = e^x + C', note: '' },
                        { label: 'General Exp', formula: '\\int a^x dx = \\frac{a^x}{\\ln a} + C', note: '' }
                    ]
                },
                {
                    title: 'Definite Integrals',
                    items: [
                        { label: 'Newton-Leibniz', formula: '\\int_a^b f(x)dx = F(b) - F(a)', note: 'F is antiderivative' },
                        { label: 'Additivity', formula: '\\int_a^c = \\int_a^b + \\int_b^c', note: '' },
                        { label: 'Linearity', formula: '\\int (af + bg) = a\\int f + b\\int g', note: '' }
                    ]
                },
                {
                    title: 'Area Calculation',
                    items: [
                        { label: 'Under Curve', formula: 'S = \\int_a^b f(x)dx', note: 'If f(x) ≥ 0' },
                        { label: 'Between Curves', formula: 'S = \\int_a^b (f(x) - g(x))dx', note: 'If f(x) ≥ g(x)' }
                    ]
                }
            ]
        };
      case ModuleType.DIFF_EQ:
        return {
            color: 'text-indigo-400',
            icon: Layers,
            sections: [
                {
                    title: 'First Order ODEs',
                    items: [
                        { label: 'Separable', formula: '\\frac{dy}{dx} = g(x)h(y) \\implies \\int \\frac{dy}{h(y)} = \\int g(x)dx', note: '' },
                        { label: 'Linear', formula: '\\frac{dy}{dx} + P(x)y = Q(x)', note: 'Use Integrating Factor' },
                        { label: 'Integrating Factor', formula: 'I(x) = e^{\\int P(x)dx}', note: 'Multiply eq by I(x)' },
                        { label: 'Solution (Linear)', formula: 'y = \\frac{1}{I(x)} \\int I(x)Q(x)dx', note: '' }
                    ]
                },
                {
                    title: 'Second Order Linear',
                    items: [
                        { label: 'Homogeneous', formula: 'ay\'\' + by\' + cy = 0', note: 'Const coeffs' },
                        { label: 'Characteristic Eq', formula: 'ar^2 + br + c = 0', note: 'Find roots r1, r2' },
                        { label: 'Distinct Roots', formula: 'y = C_1 e^{r_1 x} + C_2 e^{r_2 x}', note: 'Δ > 0' },
                        { label: 'Repeated Roots', formula: 'y = C_1 e^{rx} + C_2 x e^{rx}', note: 'Δ = 0' },
                        { label: 'Complex Roots', formula: 'y = e^{\\alpha x}(C_1 \\cos \\beta x + C_2 \\sin \\beta x)', note: 'r = α ± iβ' }
                    ]
                },
                {
                    title: 'Modeling',
                    items: [
                        { label: 'Exponential Growth', formula: '\\frac{dP}{dt} = kP \\implies P(t) = P_0 e^{kt}', note: 'k > 0' },
                        { label: 'Decay', formula: '\\frac{dN}{dt} = -\\lambda N \\implies N(t) = N_0 e^{-\\lambda t}', note: 'Half-life relation' },
                        { label: 'Logistic Growth', formula: '\\frac{dP}{dt} = rP(1 - \\frac{P}{K})', note: 'K is carrying capacity' }
                    ]
                }
            ]
        };
      default:
        return { color: 'text-slate-400', icon: FileText, sections: [] };
    }
  };

  const data = getModuleData();
  const Icon = data.icon;

  return (
    <div className="pb-20 space-y-8">
      <header className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 border-b border-white/10 pb-6">
        <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl ${data.color}`}>
          <Icon size={40} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">Exam Cheat Sheet</h2>
          <p className="text-slate-400 text-lg font-light max-w-2xl">
            Complete revision guide for <strong className="text-white">{module}</strong>. Contains essential definitions, formulas, and theorems required for final exams.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {data.sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900/40 backdrop-blur-md border border-slate-700/60 rounded-3xl overflow-hidden hover:border-slate-500/50 transition-all shadow-lg group"
          >
            <div className="bg-slate-950/40 px-6 py-4 border-b border-slate-800/50 flex justify-between items-center">
              <h3 className={`font-bold uppercase tracking-widest text-xs flex items-center gap-2 ${data.color}`}>
                {idx === 0 ? <Braces size={14}/> : idx === 1 ? <Calculator size={14}/> : <PenTool size={14}/>}
                {section.title}
              </h3>
              <span className="text-[10px] text-slate-600 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded">
                SEC {idx + 1}
              </span>
            </div>
            
            <div className="p-5 space-y-3">
              {section.items.map((item, i) => (
                <div key={i} className="relative p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group/item">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-slate-300 text-xs font-bold">{item.label}</span>
                    {item.note && <span className="text-[9px] text-slate-500 font-medium bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/50">{item.note}</span>}
                  </div>
                  <div className="font-mono text-sm text-cyan-100/90 overflow-x-auto whitespace-nowrap pb-1 custom-scrollbar">
                    <MathRenderer expression={item.formula} inline />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 font-mono">
              PRO TIP: Practice applying these formulas in the Homework section before the exam.
          </p>
      </div>
    </div>
  );
};