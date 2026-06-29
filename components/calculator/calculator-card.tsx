'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { NumberInput } from '@/components/calculator/number-input';
import { ResultField } from '@/components/calculator/result-field';
import { HistoryDrawer } from '@/components/calculator/history-drawer';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { addHistoryEntry, getHistory } from '@/lib/history';
import { sendCalculateEvent } from '@/lib/analytics';
import {
  formatCurrency,
  formatPercent,
  formatGermanNumber,
} from '@/lib/number-format';
import type {
  CalculatorMode,
  CalculationResult,
  InputMap,
  ResultLabel,
} from '@/lib/calculations/types';

export interface CalculatorCardProps {
  mode: CalculatorMode;
  values: InputMap;
  onChange: (values: InputMap) => void;
  calculation: CalculationResult;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

function formatResultValue(value: number | null | undefined, suffix?: string): string {
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

function buildCopyText(label: string, value: string): string {
  return `${label}: ${value}`;
}

function resolveResultValue(
  label: ResultLabel,
  calculation: CalculationResult
): number | null {
  if (label.isPrimary) {
    return calculation.primaryResult;
  }
  if (calculation.secondaryResults && label.name in calculation.secondaryResults) {
    return calculation.secondaryResults[label.name] ?? null;
  }
  return null;
}

const TAX_RATE_OPTIONS = [
  { value: 19, label: '19 %' },
  { value: 7, label: '7 %' },
  { value: 20, label: '20 %' },
  { value: 8.1, label: '8,1 %' },
];

const DEFAULT_TAX_RATE = 19;

export function CalculatorCard({
  mode,
  values,
  onChange,
  calculation,
  title,
  description,
}: CalculatorCardProps) {
  const t = useTranslations('calculator');
  const debouncedCalculation = useDebounce(calculation, 2000);

  React.useEffect(() => {
    if (debouncedCalculation.primaryResult === null) {
      return;
    }

    const allInputsValid = mode.inputFields.every(
      (field) => typeof debouncedCalculation.inputs[field.name] === 'number'
    );
    if (!allInputsValid) {
      return;
    }

    const inputs = debouncedCalculation.inputs as Record<string, number>;
    const history = getHistory(mode.id);
    const last = history[0];
    if (last && JSON.stringify(last.inputs) === JSON.stringify(inputs)) {
      return;
    }

    addHistoryEntry(mode.id, inputs, debouncedCalculation.primaryResult);
    sendCalculateEvent(mode.id);
  }, [debouncedCalculation, mode]);

  React.useEffect(() => {
    if (mode.id === 'mehrwertsteuer' && values.satz === null) {
      onChange({ ...values, satz: DEFAULT_TAX_RATE });
    }
  }, [mode.id, values, onChange]);

  const handleInputChange = (name: string, value: number | null) => {
    onChange({ ...values, [name]: value });
  };

  const handleHistorySelect = (inputs: Record<string, number>) => {
    onChange({ ...values, ...inputs });
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-hairline bg-canvas p-6 shadow-card',
        'lg:p-8'
      )}
    >
      {title && (
        <div className="mb-1">
          <h2 className="text-title-md text-ink">{title}</h2>
        </div>
      )}
      {description && (
        <p className="mb-6 text-body-md text-muted">{description}</p>
      )}

      <div className="space-y-5">
        {mode.id === 'mehrwertsteuer' && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${mode.id}-satz`}
              className="text-body-sm font-medium text-body"
            >
              {t('inputs.satz')}
            </label>
            <select
              id={`${mode.id}-satz`}
              value={values.satz ?? DEFAULT_TAX_RATE}
              onChange={(event) =>
                handleInputChange('satz', Number(event.target.value))
              }
              className={cn(
                'h-10 w-full rounded-md border border-hairline bg-canvas px-3 py-2',
                'text-body-md text-ink',
                'focus:border-ink focus:outline-none'
              )}
            >
              {TAX_RATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
        {mode.inputFields
          .filter(
            (field) =>
              !(mode.id === 'mehrwertsteuer' && field.name === 'satz')
          )
          .map((field) => (
            <NumberInput
              key={field.name}
              id={`${mode.id}-${field.name}`}
              label={t(field.labelKey)}
              value={values[field.name] ?? null}
              onChange={(value) => handleInputChange(field.name, value)}
              suffix={field.suffix}
              placeholder={field.placeholder}
              inputMode={field.inputmode}
            />
          ))}
      </div>

      <hr className="my-6 border-hairline-soft" />

      <div className="space-y-5">
        {mode.resultLabels.map((label) => {
          const value = resolveResultValue(label, calculation);
          const formatted = formatResultValue(value, label.suffix);
          const labelText = t(label.labelKey);
          return (
            <ResultField
              key={label.name}
              label={labelText}
              value={formatted}
              copyText={buildCopyText(labelText, formatted)}
              mode={mode.id}
            />
          );
        })}
      </div>

      <div className="mt-6">
        <HistoryDrawer mode={mode.id} onSelect={handleHistorySelect} />
      </div>
    </div>
  );
}
