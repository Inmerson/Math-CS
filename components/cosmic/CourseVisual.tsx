import React from 'react';
import { CourseId } from '../../domain/curriculum';

export const CourseVisual: React.FC<{ courseId: CourseId }> = ({ courseId }) => {
  if (courseId === 'math-analysis') {
    return (
      <svg data-testid="course-visual" data-course={courseId} aria-hidden="true" viewBox="0 0 220 130" className="h-auto w-full">
        <defs>
          <linearGradient id="analysis-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#67e8f9" /><stop offset="1" stopColor="#7c83ff" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80, 100].map((y) => <path key={y} d={`M12 ${y} C55 ${y - 28}, 85 ${y + 20}, 120 ${y - 12} S180 ${y - 25}, 208 ${y + 5}`} fill="none" stroke="rgba(98,168,255,.18)" strokeWidth="1" />)}
        <path d="M12 98 C48 92, 60 25, 94 54 S140 116, 208 25" fill="none" stroke="url(#analysis-line)" strokeWidth="3" />
        <circle cx="94" cy="54" r="4" fill="#b7e8ff" />
      </svg>
    );
  }

  return (
    <svg data-testid="course-visual" data-course={courseId} aria-hidden="true" viewBox="0 0 220 130" className="h-auto w-full">
      <defs>
        <linearGradient id="linear-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#62a8ff" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#linear-line)" strokeWidth="1.7" opacity=".9">
        <path d="M75 35 132 18 177 50 120 69Z" /><path d="M75 35v57l45 25V69" /><path d="M120 69v48l57-25V50" />
        <path d="M120 69 132 18M120 69 177 50M120 69 75 35" opacity=".45" />
        <path d="M24 104h174M120 120V12" opacity=".38" />
      </g>
      <g fill="#c4b5fd"><circle cx="75" cy="35" r="3" /><circle cx="132" cy="18" r="3" /><circle cx="177" cy="50" r="3" /><circle cx="120" cy="69" r="4" /></g>
    </svg>
  );
};
