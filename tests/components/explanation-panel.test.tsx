import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { ExplanationPanel } from '@/components/calculator/explanation-panel';
import messages from '@/messages/de.json';
import type { CalculationResult } from '@/lib/calculations/types';

function renderWithIntl(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider messages={messages} locale="de">
      {ui}
    </NextIntlClientProvider>
  );
}

const emptyResult: CalculationResult = {
  inputs: {},
  primaryResult: null,
  steps: [],
  formulaGeneral: 'W = G \\times \\frac{p}{100}',
  formulaWithValues: 'W = G \\times \\frac{p}{100}',
  warnings: [],
};

const validResult: CalculationResult = {
  inputs: { grundwert: 500, prozentsatz: 20 },
  primaryResult: 100,
  steps: [
    { label: 'Multiplikation', formula: '500 × 20 = 10000', result: 10000 },
    { label: 'Division', formula: '10000 / 100 = 100', result: 100 },
  ],
  formulaGeneral: 'W = G \\times \\frac{p}{100}',
  formulaWithValues: 'W = 500 × 20 / 100',
  warnings: [],
};

const manySteps: CalculationResult = {
  ...validResult,
  steps: [
    { label: 'Schritt 1', formula: '1 + 1 = 2' },
    { label: 'Schritt 2', formula: '2 + 2 = 4' },
    { label: 'Schritt 3', formula: '4 + 4 = 8' },
    { label: 'Schritt 4', formula: '8 + 8 = 16' },
  ],
};

describe('ExplanationPanel', () => {
  it('renders formula, placeholder and tip when result is empty', () => {
    renderWithIntl(
      <ExplanationPanel
        result={emptyResult}
        generalFormula={"W = G \\times \\frac{p}{100}"}
        tip="Test tip"
      />
    );

    expect(screen.getByText('Formel')).toBeInTheDocument();
    expect(
      screen.getByText('Gib alle Werte ein, um den Rechenweg zu sehen.')
    ).toBeInTheDocument();
    expect(screen.getByText('Test tip')).toBeInTheDocument();
  });

  it('renders substituted formula and steps when result is valid', () => {
    renderWithIntl(
      <ExplanationPanel
        result={validResult}
        generalFormula={"W = G \\times \\frac{p}{100}"}
        tip="Test tip"
      />
    );

    expect(screen.getByText('W = 500 × 20 / 100')).toBeInTheDocument();
    expect(screen.getByText(/Multiplikation/)).toBeInTheDocument();
    expect(screen.getByText('500 × 20 = 10000')).toBeInTheDocument();
    expect(screen.getByText(/Division/)).toBeInTheDocument();
  });

  it('toggles step visibility when more than three steps exist', async () => {
    renderWithIntl(
      <ExplanationPanel
        result={manySteps}
        generalFormula={"W = G \\times \\frac{p}{100}"}
        tip="Test tip"
      />
    );

    expect(screen.getByText(/Schritt 1/)).toBeInTheDocument();
    expect(screen.queryByText(/Schritt 4/)).not.toBeInTheDocument();

    const toggle = screen.getByText('Mehr anzeigen');
    await userEvent.click(toggle);

    expect(screen.getByText('Schritt 4:')).toBeInTheDocument();
    expect(screen.getByText('Weniger anzeigen')).toBeInTheDocument();
  });

  it('renders warning tip when provided', () => {
    renderWithIntl(
      <ExplanationPanel
        result={emptyResult}
        generalFormula={"W = G \\times \\frac{p}{100}"}
        tip="Test tip"
        warningTip="Achtung"
      />
    );

    expect(screen.getByText('Achtung')).toBeInTheDocument();
    expect(screen.queryByText('Test tip')).not.toBeInTheDocument();
  });

  it('renders compact bar and calls onToggleCompact when clicked', async () => {
    const handleToggle = vi.fn();
    renderWithIntl(
      <ExplanationPanel
        result={validResult}
        generalFormula={"W = G \\times \\frac{p}{100}"}
        tip="Test tip"
        compact
        onToggleCompact={handleToggle}
      />
    );

    expect(screen.getByText('Formel: W = G × p / 100')).toBeInTheDocument();
    expect(screen.getByText(/Ergebnis:/)).toBeInTheDocument();

    const bar = screen.getByRole('button');
    await userEvent.click(bar);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('does not crash when primaryResult is null in compact mode', () => {
    renderWithIntl(
      <ExplanationPanel
        result={emptyResult}
        generalFormula={"W = G \\times \\frac{p}{100}"}
        tip="Test tip"
        compact
        onToggleCompact={() => {}}
      />
    );

    expect(screen.getByText('Formel: W = G × p / 100')).toBeInTheDocument();
    expect(screen.queryByText(/Ergebnis:/)).not.toBeInTheDocument();
  });
});
