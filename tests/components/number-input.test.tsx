import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from '@/components/calculator/number-input';

describe('NumberInput', () => {
  it('renders label and suffix', () => {
    render(
      <NumberInput
        id="test-input"
        label="Grundwert"
        value={null}
        onChange={() => {}}
        suffix="€"
      />
    );

    expect(screen.getByLabelText('Grundwert')).toBeInTheDocument();
    expect(screen.getByText('€')).toBeInTheDocument();
  });

  it('calls onChange with parsed number for comma decimal input', async () => {
    const handleChange = vi.fn();
    render(
      <NumberInput
        id="test-input"
        label="Wert"
        value={null}
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Wert');
    await userEvent.type(input, '12,5');

    expect(handleChange).toHaveBeenLastCalledWith(12.5);
  });

  it('calls onChange with null for empty input', async () => {
    const handleChange = vi.fn();
    render(
      <NumberInput
        id="test-input"
        label="Wert"
        value={12.5}
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Wert');
    await userEvent.clear(input);

    expect(handleChange).toHaveBeenLastCalledWith(null);
  });
});
