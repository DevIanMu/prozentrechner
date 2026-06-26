import type {
  CalculationResult,
  CalculatorMode,
  InputMap,
} from '@/lib/calculations/types';

const FORMULA_GENERAL = 'E = G × (1 + p / 100)';

export function calculateAbzunahme(inputs: InputMap): CalculationResult {
  const ausgangswert = inputs.ausgangswert ?? null;
  const prozentsatz = inputs.prozentsatz ?? null;

  if (ausgangswert === null || prozentsatz === null) {
    return {
      inputs: { ausgangswert, prozentsatz },
      primaryResult: null,
      steps: [],
      formulaGeneral: FORMULA_GENERAL,
      formulaWithValues: FORMULA_GENERAL,
      warnings: [],
    };
  }

  const fraction = prozentsatz / 100;
  const factor = 1 + fraction;
  const primaryResult = ausgangswert * factor;

  return {
    inputs: { ausgangswert, prozentsatz },
    primaryResult,
    steps: [
      {
        label: 'Prozentsatz als Bruch',
        formula: `${prozentsatz} / 100 = ${fraction}`,
        result: fraction,
      },
      {
        label: 'Veränderungsfaktor',
        formula: `1 + ${fraction} = ${factor}`,
        result: factor,
      },
      {
        label: 'Multiplikation',
        formula: `${ausgangswert} × ${factor} = ${primaryResult}`,
        result: primaryResult,
      },
    ],
    formulaGeneral: FORMULA_GENERAL,
    formulaWithValues: `E = ${ausgangswert} × (1 + ${prozentsatz} / 100)`,
    warnings: [],
  };
}

export const abzunahmeMode: CalculatorMode = {
  id: 'abzunahme',
  path: '/abzunahme',
  labelKey: 'inputs.abzunahme',
  inputFields: [
    {
      name: 'ausgangswert',
      labelKey: 'inputs.ausgangswert',
      inputmode: 'decimal',
    },
    {
      name: 'prozentsatz',
      labelKey: 'inputs.prozentsatz',
      suffix: '%',
      inputmode: 'decimal',
    },
  ],
  resultLabels: [
    {
      name: 'ergebnis',
      labelKey: 'inputs.ergebnis',
      isPrimary: true,
    },
  ],
  calculate: calculateAbzunahme,
};
