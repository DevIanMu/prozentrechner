import type {
  CalculationResult,
  CalculatorMode,
  InputMap,
} from '@/lib/calculations/types';

const FORMULA_GENERAL = 'p% = (W₂ - W₁) / W₁ × 100';

export function calculateVeraenderung(inputs: InputMap): CalculationResult {
  const alterWert = inputs.alterWert ?? null;
  const neuerWert = inputs.neuerWert ?? null;

  if (alterWert === null || neuerWert === null) {
    return {
      inputs: { alterWert, neuerWert },
      primaryResult: null,
      steps: [],
      formulaGeneral: FORMULA_GENERAL,
      formulaWithValues: FORMULA_GENERAL,
      warnings: [],
    };
  }

  if (alterWert === 0) {
    return {
      inputs: { alterWert, neuerWert },
      primaryResult: null,
      steps: [],
      formulaGeneral: FORMULA_GENERAL,
      formulaWithValues: FORMULA_GENERAL,
      warnings: ['Division durch Null nicht möglich.'],
    };
  }

  const difference = neuerWert - alterWert;
  const quotient = difference / alterWert;
  const primaryResult = quotient * 100;

  return {
    inputs: { alterWert, neuerWert },
    primaryResult,
    steps: [
      {
        label: 'Differenz',
        formula: `${neuerWert} - ${alterWert} = ${difference}`,
        result: difference,
      },
      {
        label: 'Division',
        formula: `${difference} / ${alterWert} = ${quotient}`,
        result: quotient,
      },
      {
        label: 'Multiplikation',
        formula: `${quotient} × 100 = ${primaryResult}`,
        result: primaryResult,
      },
    ],
    formulaGeneral: FORMULA_GENERAL,
    formulaWithValues: `p% = (${neuerWert} - ${alterWert}) / ${alterWert} × 100`,
    warnings: [],
  };
}

export const veraenderungMode: CalculatorMode = {
  id: 'prozentuale-veraenderung',
  path: '/prozentuale-veraenderung',
  labelKey: 'calculator.inputs.prozentualeVeraenderung',
  inputFields: [
    {
      name: 'alterWert',
      labelKey: 'calculator.inputs.alterWert',
      inputmode: 'decimal',
    },
    {
      name: 'neuerWert',
      labelKey: 'calculator.inputs.neuerWert',
      inputmode: 'decimal',
    },
  ],
  resultLabels: [
    {
      name: 'prozentualeVeraenderung',
      labelKey: 'calculator.inputs.prozentualeVeraenderung',
      suffix: '%',
      isPrimary: true,
    },
  ],
  calculate: calculateVeraenderung,
};
