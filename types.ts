import type React from 'react';
import type { CourseId, TopicId } from './domain/curriculum';

export type MatrixData = number[][];

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
  SCALAR = 'SCALAR',
}

export type AppSection =
  | 'dashboard'
  | 'course'
  | 'lesson'
  | 'math-lab'
  | 'practice'
  | 'exams'
  | 'progress'
  | 'formulas'
  | 'assistant';

export type MathLabId = 'function' | 'matrix' | 'vector-geometry';

export interface AppDestination {
  section: AppSection;
  courseId?: CourseId;
  topicId?: TopicId;
  labId?: MathLabId;
}

export type IconComponent = React.ComponentType<{ size?: number; className?: string }>;
