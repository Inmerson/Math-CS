import { render, screen } from '@testing-library/react'; import { describe, expect, it } from 'vitest'; import { MatrixLab } from './MatrixLab';
describe('MatrixLab',()=>{it('returns a deterministic determinant',()=>{render(<MatrixLab/>);expect(screen.getByRole('status')).toHaveTextContent('det(A) = -2');});});
