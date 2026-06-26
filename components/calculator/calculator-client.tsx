'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorCard } from '@/components/calculator/calculator-card';
import { ExplanationPanel } from '@/components/calculator/explanation-panel';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { RelatedCalculators } from '@/components/related-calculators';
import { FAQBand } from '@/components/faq-band';
import { Quiz } from '@/components/quiz';
import { useUrlHash } from '@/lib/hooks/use-url-hash';
import { modesById } from '@/lib/calculations';
import type { CalculatorContent } from '@/lib/content';

export interface CalculatorClientProps {
  modeId: string;
  content: CalculatorContent;
  breadcrumbItems?: { name: string; url: string }[];
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

function Paragraphs({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-body-md text-body whitespace-pre-wrap"
        >
          {paragraph}
        </p>
      ))}
    </>
  );
}

export function CalculatorClient({
  modeId,
  content,
  breadcrumbItems,
}: CalculatorClientProps) {
  const t = useTranslations('calculator');
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
    <>
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} />
      )}

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

      <section className="bg-surface-card py-12 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-title-md text-ink mb-6">
            {t('steps')}
          </h2>

          {calculation.steps.length === 0 ? (
            <p className="text-body-md text-muted-soft">
              {t('stepsPlaceholder')}
            </p>
          ) : (
            <ol className="space-y-4">
              {calculation.steps.map((step, index) => (
                <li
                  key={index}
                  className="text-body-md text-ink"
                >
                  <span className="font-medium">{step.label}:</span>{' '}
                  {step.formula}
                </li>
              ))}
            </ol>
          )}

          <div className="mt-8">
            {content.warningTip ? (
              <p className="text-body-md text-warning">
                <span aria-hidden="true">⚠️ </span>
                {content.warningTip}
              </p>
            ) : (
              <p className="text-body-md text-muted-soft">
                <span aria-hidden="true">💡 </span>
                {content.tip}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-canvas py-12 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <RelatedCalculators modeIds={content.relatedModes} />
        </div>
      </section>

      <section className="bg-surface-card py-12 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h2 className="text-title-md text-ink">
                {content.educationTitle}
              </h2>
              <Paragraphs text={content.educationText} />
            </div>
            <div>
              <Quiz items={content.quiz} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas py-12 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <FAQBand items={content.faq} />
        </div>
      </section>
    </>
  );
}
