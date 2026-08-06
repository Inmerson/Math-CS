import { ModuleType, ViewMode } from '../types';

export interface LearningDestinationRef {
  module: ModuleType;
  view: ViewMode;
}

export interface LearningDestination extends LearningDestinationRef {
  moduleTitle: string;
  title: string;
  description: string;
  keywords: string[];
}

const MODULE_DEFAULT_VIEWS: Record<ModuleType, ViewMode> = {
  [ModuleType.HOME]: ViewMode.BASICS,
  [ModuleType.MATRIX]: ViewMode.BASICS,
  [ModuleType.SEQUENCES]: ViewMode.SEQUENCES,
  [ModuleType.FUNCTIONS]: ViewMode.FUNCTIONS,
  [ModuleType.LIMITS]: ViewMode.FUNCTIONS,
  [ModuleType.DERIVATIVES]: ViewMode.DERIVATIVE_RULES,
  [ModuleType.INTEGRALS]: ViewMode.INTEGRAL_BASICS,
  [ModuleType.DIFF_EQ]: ViewMode.DIFF_BASICS,
  [ModuleType.EXAMS]: ViewMode.FULL_EXAM,
};

export const LEARNING_DESTINATIONS: LearningDestination[] = [
  { module: ModuleType.MATRIX, view: ViewMode.BASICS, moduleTitle: 'Matrix', title: 'Matrix Definitions', description: 'Rows, columns, dimensions and matrix notation.', keywords: ['linear algebra', 'matrix basics', 'dimensions'] },
  { module: ModuleType.MATRIX, view: ViewMode.OPERATIONS, moduleTitle: 'Matrix', title: 'Matrix Operations', description: 'Addition, subtraction, scalar and matrix multiplication.', keywords: ['multiply matrices', 'matrix arithmetic'] },
  { module: ModuleType.MATRIX, view: ViewMode.GAUSSIAN, moduleTitle: 'Matrix', title: 'Gaussian Elimination', description: 'Solve linear systems through row reduction.', keywords: ['row echelon', 'rref', 'linear systems'] },
  { module: ModuleType.MATRIX, view: ViewMode.SYSTEMS, moduleTitle: 'Matrix', title: "Cramer's Systems", description: 'Solve systems with determinants and Cramer’s rule.', keywords: ['cramer rule', 'simultaneous equations'] },
  { module: ModuleType.MATRIX, view: ViewMode.INVERSE, moduleTitle: 'Matrix', title: 'Inverse Matrix', description: 'Understand and calculate matrix inverses.', keywords: ['inverse', 'identity matrix'] },
  { module: ModuleType.MATRIX, view: ViewMode.DETERMINANT, moduleTitle: 'Matrix', title: 'Determinant', description: 'Interpret determinants geometrically and algebraically.', keywords: ['det', 'area scale', 'volume scale'] },
  { module: ModuleType.MATRIX, view: ViewMode.EIGENVALUES, moduleTitle: 'Matrix', title: 'Eigenvalues', description: 'Explore eigenvalues, eigenvectors and invariant directions.', keywords: ['eigenvector', 'spectral theory'] },
  { module: ModuleType.MATRIX, view: ViewMode.VECTOR_OPS_3D, moduleTitle: 'Matrix', title: 'Vector Lab (3D)', description: 'Visualize vector operations in three-dimensional space.', keywords: ['vector', 'dot product', 'cross product', '3d'] },
  { module: ModuleType.MATRIX, view: ViewMode.VECTOR_3D, moduleTitle: 'Matrix', title: 'Matrix Warper (3D)', description: 'Observe linear transformations of space.', keywords: ['linear transformation', 'basis', '3d'] },
  { module: ModuleType.SEQUENCES, view: ViewMode.SEQUENCES, moduleTitle: 'Sequences', title: 'Limits & Monotonicity', description: 'Study convergence, bounds and monotone sequences.', keywords: ['sequence limit', 'convergence', 'monotonicity'] },
  { module: ModuleType.SEQUENCES, view: ViewMode.COBWEB, moduleTitle: 'Sequences', title: 'Chaos & Cobweb', description: 'Observe iterative maps and sensitive dynamics.', keywords: ['chaos', 'iteration', 'logistic map'] },
  { module: ModuleType.SEQUENCES, view: ViewMode.SEQUENCES_3D, moduleTitle: 'Sequences', title: '3D Helix Visualizer', description: 'Represent indexed values as spatial trajectories.', keywords: ['helix', 'sequence visualization', '3d'] },
  { module: ModuleType.SEQUENCES, view: ViewMode.SERIES, moduleTitle: 'Sequences', title: 'Partial Sums', description: 'Build infinite series from their finite partial sums.', keywords: ['series', 'summation', 'convergence tests'] },
  { module: ModuleType.FUNCTIONS, view: ViewMode.FUNCTIONS, moduleTitle: 'Functions', title: 'Graphing & Domain', description: 'Inspect graphs, domains, ranges and key properties.', keywords: ['function graph', 'domain', 'range'] },
  { module: ModuleType.FUNCTIONS, view: ViewMode.TRANSFORMATIONS, moduleTitle: 'Functions', title: 'Transformations', description: 'Translate, scale and reflect mathematical functions.', keywords: ['shift', 'reflection', 'stretch'] },
  { module: ModuleType.FUNCTIONS, view: ViewMode.FUNCTIONS_3D, moduleTitle: 'Functions', title: 'Surface Plotter (3D)', description: 'Explore functions of two variables as surfaces.', keywords: ['multivariable function', 'surface', '3d'] },
  { module: ModuleType.FUNCTIONS, view: ViewMode.NEWTON, moduleTitle: 'Functions', title: 'Newton Optimization', description: 'Use tangent-based iteration to locate roots and optima.', keywords: ['newton method', 'root finding', 'optimization'] },
  { module: ModuleType.LIMITS, view: ViewMode.FUNCTIONS, moduleTitle: 'Limits', title: 'Limit Analysis', description: 'Explore one-sided limits and asymptotic behavior.', keywords: ['limit', 'asymptote', 'approach'] },
  { module: ModuleType.LIMITS, view: ViewMode.CONTINUITY, moduleTitle: 'Limits', title: 'Continuity & Holes', description: 'Distinguish removable, jump and infinite discontinuities.', keywords: ['continuity', 'discontinuity', 'holes'] },
  { module: ModuleType.LIMITS, view: ViewMode.LIMITS_3D, moduleTitle: 'Limits', title: '3D Limits', description: 'Approach multivariable limits from different paths.', keywords: ['multivariable limit', 'path dependence', '3d'] },
  { module: ModuleType.DERIVATIVES, view: ViewMode.DERIVATIVE_RULES, moduleTitle: 'Derivatives', title: 'Rules & Formulas', description: 'Apply product, quotient and chain rules.', keywords: ['differentiate', 'chain rule', 'product rule'] },
  { module: ModuleType.DERIVATIVES, view: ViewMode.FUNCTION_ANALYSIS, moduleTitle: 'Derivatives', title: 'Curve Analysis', description: 'Find extrema, monotonicity and concavity intervals.', keywords: ['critical points', 'maximum', 'minimum', 'concavity'] },
  { module: ModuleType.DERIVATIVES, view: ViewMode.DERIVATIVES_3D, moduleTitle: 'Derivatives', title: 'Tangent Planes (3D)', description: 'Visualize partial derivatives and tangent planes.', keywords: ['partial derivative', 'gradient', 'tangent plane'] },
  { module: ModuleType.DERIVATIVES, view: ViewMode.TAYLOR, moduleTitle: 'Derivatives', title: 'Taylor Series', description: 'Approximate functions with local polynomial models.', keywords: ['taylor', 'maclaurin', 'polynomial approximation'] },
  { module: ModuleType.INTEGRALS, view: ViewMode.INTEGRAL_BASICS, moduleTitle: 'Integrals', title: 'Integral Concept', description: 'Connect antiderivatives, accumulation and constants.', keywords: ['antiderivative', 'indefinite integral', 'constant'] },
  { module: ModuleType.INTEGRALS, view: ViewMode.INTEGRAL_RULES, moduleTitle: 'Integrals', title: 'Rules & Formulas', description: 'Apply core integration rules and substitutions.', keywords: ['integration rules', 'substitution'] },
  { module: ModuleType.INTEGRALS, view: ViewMode.AREA_UNDER_CURVE, moduleTitle: 'Integrals', title: 'Area & FTC', description: 'Relate definite integrals to area and the fundamental theorem.', keywords: ['fundamental theorem of calculus', 'definite integral', 'area'] },
  { module: ModuleType.INTEGRALS, view: ViewMode.INTEGRALS_3D, moduleTitle: 'Integrals', title: 'Solid of Revolution', description: 'Generate and inspect volumes formed by rotation.', keywords: ['volume', 'washer method', 'disk method', '3d'] },
  { module: ModuleType.DIFF_EQ, view: ViewMode.DIFF_BASICS, moduleTitle: 'Differential Equations', title: 'Solutions & Curves', description: 'Interpret differential equations and solution families.', keywords: ['ode', 'solution curve', 'initial condition'] },
  { module: ModuleType.DIFF_EQ, view: ViewMode.POPULATION_MODELS, moduleTitle: 'Differential Equations', title: 'Population Models', description: 'Compare exponential and logistic population growth.', keywords: ['population growth', 'malthus', 'verhulst', 'logistic growth', 'biotechnology'] },
  { module: ModuleType.DIFF_EQ, view: ViewMode.RADIOACTIVE_DECAY, moduleTitle: 'Differential Equations', title: 'Radioactive Decay', description: 'Model exponential decay and half-life.', keywords: ['half life', 'decay', 'isotope'] },
  { module: ModuleType.DIFF_EQ, view: ViewMode.DIFF_EQ_3D, moduleTitle: 'Differential Equations', title: 'Lorenz Attractor (3D)', description: 'Observe a classical nonlinear dynamical system.', keywords: ['lorenz', 'chaos theory', 'dynamical systems', '3d'] },
  { module: ModuleType.EXAMS, view: ViewMode.FULL_EXAM, moduleTitle: 'Exams', title: 'Final Exam', description: 'Complete a comprehensive mixed-topic assessment.', keywords: ['assessment', 'practice exam', 'final'] },
  { module: ModuleType.EXAMS, view: ViewMode.EXAM_ANALYSIS, moduleTitle: 'Exams', title: 'Performance Analytics', description: 'Review strengths, weaknesses and question outcomes.', keywords: ['results', 'analytics', 'score', 'progress'] },
];

const normalizeSearchText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const getDefaultViewForModule = (module: ModuleType): ViewMode =>
  MODULE_DEFAULT_VIEWS[module];

export const getLearningDestination = (
  destination: LearningDestinationRef | null,
): LearningDestination | null => {
  if (!destination) {
    return null;
  }

  return (
    LEARNING_DESTINATIONS.find(
      (item) => item.module === destination.module && item.view === destination.view,
    ) ?? null
  );
};

export const searchLearningDestinations = (
  query: string,
  limit = 6,
): LearningDestination[] => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return [];
  }

  const queryTokens = normalizedQuery.split(/\s+/);

  return LEARNING_DESTINATIONS
    .map((destination, index) => {
      const normalizedTitle = normalizeSearchText(destination.title);
      const normalizedModule = normalizeSearchText(destination.moduleTitle);
      const normalizedKeywords = normalizeSearchText(destination.keywords.join(' '));
      const searchableText = normalizeSearchText(
        `${destination.title} ${destination.moduleTitle} ${destination.description} ${destination.keywords.join(' ')}`,
      );

      if (!queryTokens.every((token) => searchableText.includes(token))) {
        return null;
      }

      let score = 5;
      if (normalizedTitle === normalizedQuery) score = 0;
      else if (normalizedTitle.startsWith(normalizedQuery)) score = 1;
      else if (normalizedTitle.includes(normalizedQuery)) score = 2;
      else if (normalizedKeywords.includes(normalizedQuery)) score = 3;
      else if (normalizedModule.includes(normalizedQuery)) score = 4;

      return { destination, score, index };
    })
    .filter(
      (
        result,
      ): result is {
        destination: LearningDestination;
        score: number;
        index: number;
      } => result !== null,
    )
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, limit)
    .map(({ destination }) => destination);
};
