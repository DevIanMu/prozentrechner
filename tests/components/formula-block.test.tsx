import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FormulaBlock } from '@/components/calculator/formula-block';

describe('FormulaBlock', () => {
  it('renders a visually hidden description before the aria-hidden formula', () => {
    const { container } = render(
      <FormulaBlock latex="W = G × p / 100" description="W gleich G mal p durch 100" />
    );

    const srOnly = container.querySelector('.sr-only');
    expect(srOnly).toHaveTextContent('W gleich G mal p durch 100');

    const formula = container.querySelector('[aria-hidden="true"]');
    expect(formula).toBeInTheDocument();
    expect(formula).toHaveAttribute('aria-hidden', 'true');
  });

  it('falls back to the raw latex string when no description is provided', () => {
    const { container } = render(<FormulaBlock latex="W = G × p / 100" />);

    const srOnly = container.querySelector('.sr-only');
    expect(srOnly).toHaveTextContent('W = G × p / 100');
  });
});
