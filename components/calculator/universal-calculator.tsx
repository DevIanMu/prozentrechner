'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { NumberInput } from '@/components/calculator/number-input';
import { modes } from '@/lib/calculations';
import {
  formatCurrency,
  formatPercent,
  formatGermanNumber,
} from '@/lib/number-format';
import type {
  CalculatorMode,
  InputMap,
  CalculationResult,
  ResultLabel,
} from '@/lib/calculations/types';

function formatResultValue(
  value: number | null | undefined,
  suffix?: string
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '-';
  }
  if (suffix === '€') {
    return formatCurrency(value);
  }
  if (suffix === '%') {
    return formatPercent(value);
  }
  return formatGermanNumber(value);
}

function resolveResultValue(
  label: ResultLabel,
  calculation: CalculationResult
): number | null {
  if (label.isPrimary) {
    return calculation.primaryResult;
  }
  if (
    calculation.secondaryResults &&
    label.name in calculation.secondaryResults
  ) {
    return calculation.secondaryResults[label.name] ?? null;
  }
  return null;
}

interface InlineInputProps {
  mode: CalculatorMode;
  name: string;
  values: InputMap;
  onChange: (name: string, value: number | null) => void;
  t: (key: string) => string;
}

function InlineInput({ mode, name, values, onChange, t }: InlineInputProps) {
  const field = mode.inputFields.find((f) => f.name === name);
  if (!field) return null;

  return (
    <span className="mx-1 inline-block w-28 align-middle">
      <NumberInput
        id={`${mode.id}-${name}`}
        label={t(field.labelKey)}
        value={values[name] ?? null}
        onChange={(value) => onChange(name, value)}
        suffix={field.suffix}
        placeholder={field.placeholder}
        inputMode={field.inputmode}
        hideLabel
      />
    </span>
  );
}

interface ResultValueProps {
  label: ResultLabel;
  calculation: CalculationResult;
}

function ResultValue({ label, calculation }: ResultValueProps) {
  const value = resolveResultValue(label, calculation);
  return (
    <span className="font-semibold text-ink">
      {formatResultValue(value, label.suffix)}
    </span>
  );
}

interface ModeCardProps {
  mode: CalculatorMode;
}

function ModeCard({ mode }: ModeCardProps) {
  const t = useTranslations('calculator');
  const [values, setValues] = React.useState<InputMap>(() => {
    const initial: InputMap = Object.fromEntries(
      mode.inputFields.map((field) => [field.name, null])
    );
    if (mode.id === 'mehrwertsteuer') {
      initial.satz = 19;
    }
    return initial;
  });

  const calculation = React.useMemo(
    () => mode.calculate(values),
    [mode, values]
  );

  const handleChange = React.useCallback(
    (name: string, value: number | null) => {
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const input = (name: string) => (
    <InlineInput
      mode={mode}
      name={name}
      values={values}
      onChange={handleChange}
      t={t}
    />
  );

  const primaryLabel = mode.resultLabels.find((label) => label.isPrimary);
  const endpreisLabel = mode.resultLabels.find(
    (label) => label.name === 'endpreis'
  );
  const nettoLabel = mode.resultLabels.find((label) => label.name === 'netto');

  let sentence: React.ReactNode;
  switch (mode.id) {
    case 'prozentwert':
      sentence = (
        <>
          Wie viel sind {input('prozentsatz')} % von {input('grundwert')}?
        </>
      );
      break;
    case 'prozentsatz':
      sentence = (
        <>
          {input('prozentwert')} sind wie viel Prozent von {input('grundwert')}?
        </>
      );
      break;
    case 'grundwert':
      sentence = (
        <>
          {input('prozentwert')} sind {input('prozentsatz')} %. Wie hoch ist der
          Grundwert?
        </>
      );
      break;
    case 'prozentuale-veraenderung':
      sentence = (
        <>
          Von {input('alterWert')} auf {input('neuerWert')}. Wie groß ist die
          prozentuale Veränderung?
        </>
      );
      break;
    case 'rabatt-berechnen':
      sentence = (
        <>
          Wie hoch ist der Rabatt bei {input('preis')} mit {input('rabatt')} %?
        </>
      );
      break;
    case 'mehrwertsteuer':
      sentence = (
        <>
          Wie viel MwSt. sind in {input('brutto')} bei {input('satz')} %?
        </>
      );
      break;
    case 'abzunahme':
      sentence = (
        <>
          Wie hoch ist {input('ausgangswert')} erhöht/verringert um{' '}
          {input('prozentsatz')} %?
        </>
      );
      break;
    default:
      sentence = null;
  }

  const isComplete = mode.inputFields.every(
    (field) => typeof values[field.name] === 'number'
  );

  return (
    <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-card">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3 text-body-md text-body">
        <span className="leading-relaxed">{sentence}</span>
        {primaryLabel && (
          <span className="whitespace-nowrap">
            = <ResultValue label={primaryLabel} calculation={calculation} />
            {mode.id === 'rabatt-berechnen' && endpreisLabel && (
              <span className="ml-2 text-body-sm text-muted">
                (Endpreis:{' '}
                <ResultValue label={endpreisLabel} calculation={calculation} />)
              </span>
            )}
            {mode.id === 'mehrwertsteuer' && nettoLabel && (
              <span className="ml-2 text-body-sm text-muted">
                (Netto:{' '}
                <ResultValue label={nettoLabel} calculation={calculation} />)
              </span>
            )}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-caption text-muted-soft">
          {isComplete && calculation.formulaWithValues
            ? calculation.formulaWithValues
            : calculation.formulaGeneral}
        </p>
        <Link
          href={mode.path}
          className="text-body-sm font-medium text-brand-accent hover:underline"
        >
          {t('learnMore')}
        </Link>
      </div>
    </div>
  );
}

export function UniversalCalculator() {
  return (
    <section className="bg-surface-soft">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="space-y-6">
          {modes.map((mode) => (
            <ModeCard key={mode.id} mode={mode} />
          ))}
        </div>
      </div>
    </section>
  );
}
