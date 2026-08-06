import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathRendererProps {
  expression: string;
  inline?: boolean;
  className?: string;
  color?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ expression, inline = false, className = '', color }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
        try {
            // We use renderToString and manual innerHTML assignment to bypass
            // KaTeX's strict document.compatMode check, which can trigger false positives
            // in some sandboxed environments (like iframes) even with valid DOCTYPEs.
            const html = katex.renderToString(expression, {
                throwOnError: false,
                displayMode: !inline,
                output: 'html',
                trust: true,
                strict: false
            });
            containerRef.current.innerHTML = html;
        } catch (e) {
            console.error("KaTeX render error:", e);
            // Fallback to text if rendering fails
            containerRef.current.textContent = expression;
        }
    }
  }, [expression, inline]);

  return (
    <div 
        ref={containerRef} 
        className={`math-renderer ${inline ? 'inline-block' : 'block my-2'} ${className}`}
        style={{ color: color }}
    />
  );
};