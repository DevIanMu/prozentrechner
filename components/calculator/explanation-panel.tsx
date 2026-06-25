'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { FormulaBlock } from '@/components/calculator/formula-block';
import { formatGermanNumber } from '@/lib/number-format';
import type { CalculationResult } from '@/lib/calculations/types';

export interface ExplanationPanelProps {
  result: CalculationResult;
  generalFormula: string;
  tip: string;
  warningTip?: string;
  compact?: boolean;
  onToggleCompact?: () => void;
}

function latexToPlainText(latex: string): string {
  return latex
    .replace(/\\times/g, '×')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 / $2')
    .replace(/[{}\\]/g, '')
    .trim();
}

export function ExplanationPanel({
  result,
  generalFormula,
  tip,
  warningTip,
  compact = false,
  onToggleCompact,
}: ExplanationPanelProps) {
  const t = useTranslations('calculator');
  const [stepsExpanded, setStepsExpanded] = React.useState(false);

  const hasValidResult = result.primaryResult !== null;
  const primaryResultFormatted = formatGermanNumber(result.primaryResult);

  const visibleSteps = stepsExpanded
    ? result.steps
    : result.steps.slice(0, 3);
  const hasMoreSteps = result.steps.length > 3;

  if (compact) {
    return (
      <button
        type="button"
        onClick={onToggleCompact}
        className={cn(
          'w-full rounded-lg border border-hairline bg-surface-card p-4 text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
      >
        <div className="text-body-sm text-muted-soft">
          {t('formula')}: {latexToPlainText(generalFormula)}
        </div>
        {hasValidResult && (
          <div className="mt-1 text-body-md font-medium text-ink">
            {t('result')}: {primaryResultFormatted}
          </div>
        )}
      </button>
    );
  }

  return (
    <section className="space-y-6 rounded-lg border border-hairline bg-surface-card p-6">
      <span className="sr-only">
        {t('formula')} in mathematischer Schreibweise
      </span>

      <div>
        <h3 className="text-title-md text-ink">{t('formula')}</h3>
        <div className="mt-3">
          <FormulaBlock latex={generalFormula} />
        </div>
        {hasValidResult && result.formulaWithValues && (
          <div className="mt-3 rounded-md border border-hairline bg-canvas p-4 text-body-md text-ink">
            {result.formulaWithValues}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-title-md text-ink">{t('steps')}</h3>
        {result.steps.length === 0 ? (
          <p className="mt-3 text-body-md text-muted-soft">
            {t('stepsPlaceholder')}
          </p>
        ) : (
          <>
            <ol className="mt-3 space-y-3">
              {visibleSteps.map((step, index) => (
                <li key={index} className="text-body-md text-ink">
                  <span className="font-medium">{step.label}:</span>{' '}
                  {step.formula}
                </li>
              ))}
            </ol>
            {hasMoreSteps && (
              <button
                type="button"
                onClick={() => setStepsExpanded((prev) => !prev)}
                className="mt-3 text-body-sm text-brand-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {stepsExpanded ? t('showLess') : t('showMore')}
              </button>
            )}
          </>
        )}
      </div>

      <div>
        {warningTip ? (
          <p className="text-body-md text-warning">
            <span aria-hidden="true">⚠️ </span>
            {warningTip}
          </p>
        ) : (
          <p className="text-body-md text-muted-soft">
            <span aria-hidden="true">💡 </span>
            {tip}
          </p>
        )}
      </div>
    </section>
  );
}
