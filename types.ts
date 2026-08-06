
import React from 'react';

export type MatrixData = number[][];

export enum ModuleType {
  HOME = 'HOME',
  MATRIX = 'MATRIX',
  SEQUENCES = 'SEQUENCES',
  FUNCTIONS = 'FUNCTIONS',
  LIMITS = 'LIMITS',
  DERIVATIVES = 'DERIVATIVES',
  INTEGRALS = 'INTEGRALS',
  DIFF_EQ = 'DIFF_EQ',
  EXAMS = 'EXAMS'
}

export enum ViewMode {
  // Matrix Module
  BASICS = 'BASICS',
  OPERATIONS = 'OPERATIONS',
  DETERMINANT = 'DETERMINANT',
  INVERSE = 'INVERSE',
  SYSTEMS = 'SYSTEMS', // Cramer's Rule
  GAUSSIAN = 'GAUSSIAN',
  EIGENVALUES = 'EIGENVALUES',
  VECTOR_3D = 'VECTOR_3D',
  VECTOR_OPS_3D = 'VECTOR_OPS_3D',
  
  // Sequence Module
  SEQUENCES = 'SEQUENCES', // Includes Recursive & Monotonicity Check
  SERIES = 'SERIES',
  COBWEB = 'COBWEB',
  SEQUENCES_3D = 'SEQUENCES_3D',
  
  // Function Module
  FUNCTIONS = 'FUNCTIONS', // Graphing, Domain, Range
  TRANSFORMATIONS = 'TRANSFORMATIONS',
  NEWTON = 'NEWTON',
  FUNCTIONS_3D = 'FUNCTIONS_3D',
  
  // Limits Module
  LIMITS = 'LIMITS', 
  CONTINUITY = 'CONTINUITY', // Holes & Jumps
  LIMITS_3D = 'LIMITS_3D',

  // Derivatives Module
  DERIVATIVE_RULES = 'DERIVATIVE_RULES',
  FUNCTION_ANALYSIS = 'FUNCTION_ANALYSIS', // Extrema & Monotonicity Intervals
  TAYLOR = 'TAYLOR',
  DERIVATIVES_3D = 'DERIVATIVES_3D',

  // Integrals Module
  INTEGRAL_BASICS = 'INTEGRAL_BASICS',
  INTEGRAL_RULES = 'INTEGRAL_RULES',
  AREA_UNDER_CURVE = 'AREA_UNDER_CURVE',
  INTEGRALS_3D = 'INTEGRALS_3D',

  // Differential Equations Module
  DIFF_BASICS = 'DIFF_BASICS',
  POPULATION_MODELS = 'POPULATION_MODELS', // Malthus & Verhulst
  RADIOACTIVE_DECAY = 'RADIOACTIVE_DECAY',
  DIFF_EQ_3D = 'DIFF_EQ_3D',

  // Exams Module
  CLASS_EXAM_1 = 'CLASS_EXAM_1',
  CLASS_EXAM_2 = 'CLASS_EXAM_2',
  CLASS_EXAM_3 = 'CLASS_EXAM_3',
  FULL_EXAM = 'FULL_EXAM',
  EXAM_ANALYSIS = 'EXAM_ANALYSIS',

  // Shared/Tools
  CHEAT_SHEET = 'CHEAT_SHEET',
  HOMEWORK = 'HOMEWORK', // Renamed from EXERCISES
  FINAL_EXAM = 'FINAL_EXAM',
  AI_CHAT = 'AI_CHAT'
}

export interface MatrixProps {
  data: MatrixData;
  label?: string;
  editable?: boolean;
  onChange?: (newData: MatrixData) => void;
  highlightRow?: number | null;
  highlightCol?: number | null;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'red' | 'cyan';
}

export enum OperationType {
  ADD = 'ADD',
  SUBTRACT = 'SUBTRACT',
  MULTIPLY = 'MULTIPLY',
  SCALAR = 'SCALAR'
}

// Common definition for Three Fiber elements
interface ThreeElements {
  ambientLight: any;
  pointLight: any;
  directionalLight: any;
  spotLight: any;
  hemisphereLight: any;
  group: any;
  mesh: any;
  meshStandardMaterial: any;
  meshBasicMaterial: any;
  meshPhongMaterial: any;
  sphereGeometry: any;
  cylinderGeometry: any;
  planeGeometry: any;
  boxGeometry: any;
  latheGeometry: any;
  bufferGeometry: any;
  arrowHelper: any;
  axesHelper: any;
  gridHelper: any;
  color: any;
  fog: any;
  primitive: any;
  line: any;
  [elemName: string]: any;
}

// Augment global JSX.IntrinsicElements for React Three Fiber components
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
