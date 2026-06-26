'use client';

import * as React from 'react';
import { CalculatorCard } from '@/components/calculator/calculator-card';
import { ExplanationPanel } from '@/components/calculator/explanation-panel';
import { useUrlHash } from '@/lib/hooks/use-url-hash';
import { modesById } from '@/lib/calculations';
import type { CalculatorContent } from '@/lib/content';

export interface CalculatorClientProps {
  modeId: string;
  content: CalculatorContent;
}

function serializeInputMap(values: Record<string, number | null>): string {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== null && !Number.isNaN(value)) {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

function deserializeInputMap(hash: string): Record<string, number | null> {
  const params = new URLSearchParams(hash);
  const result: Record<string, number | null> = {};
  params.forEach((raw, key) => {
    const value = Number(raw);
    result[key] = Number.isFinite(value) ? value : null;
  });
  return result;
}

export function CalculatorClient({ modeId, content }: CalculatorClientProps) {
  const [isExplanationExpanded, setIsExplanationExpanded] = React.useState(false);
  const mode = modesById[modeId];

  const initialValues = React.useMemo(() => {
    return Object.fromEntries(mode.inputFields.map((field) => [field.name, null]));
  }, [mode]);

  const [values, setValues] = useUrlHash<Record<string, number | null>>({
    initialValues,
    serialize: serializeInputMap,
    deserialize: deserializeInputMap,
  });

  const calculation = React.useMemo(() => mode.calculate(values), [mode, values]);

  return (
    <section className="bg-canvas py-12 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-display-sm text-ink lg:text-display-md">
            {content.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-body-md text-body">
            {content.intro}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:gap-8">
          <CalculatorCard
            mode={mode}
            values={values}
            onChange={setValues}
            calculation={calculation}
          />

          <div className="hidden lg:block">
            <ExplanationPanel
              result={calculation}
              generalFormula={content.formulaGeneral}
              tip={content.tip}
              warningTip={content.warningTip}
            />
          </div>
        </div>

        <div className="mt-6 lg:hidden">
          <ExplanationPanel
            result={calculation}
            generalFormula={content.formulaGeneral}
            tip={content.tip}
            warningTip={content.warningTip}
            compact={!isExplanationExpanded}
            onToggleCompact={() => setIsExplanationExpanded((prev) => !prev)}
          />
        </div>
      </div>
    </section>
  );
}
