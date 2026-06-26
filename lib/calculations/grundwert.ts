import type {
  CalculationResult,
  CalculatorMode,
  InputMap,
} from '@/lib/calculations/types';

const FORMULA_GENERAL = 'G = W / p × 100';

export function calculateGrundwert(inputs: InputMap): CalculationResult {
  const prozentwert = inputs.prozentwert ?? null;
  const prozentsatz = inputs.prozentsatz ?? null;

  if (prozentwert === null || prozentsatz === null) {
    return {
      inputs: { prozentwert, prozentsatz },
      primaryResult: null,
      steps: [],
      formulaGeneral: FORMULA_GENERAL,
      formulaWithValues: FORMULA_GENERAL,
      warnings: [],
    };
  }

  if (prozentsatz === 0) {
    return {
      inputs: { prozentwert, prozentsatz },
      primaryResult: null,
      steps: [],
      formulaGeneral: FORMULA_GENERAL,
      formulaWithValues: `G = ${prozentwert} / ${prozentsatz} × 100`,
      warnings: ['Division durch Null nicht möglich.'],
    };
  }

  const quotient = prozentwert / prozentsatz;
  const primaryResult = quotient * 100;

  return {
    inputs: { prozentwert, prozentsatz },
    primaryResult,
    steps: [
      {
        label: 'Division',
        formula: `${prozentwert} / ${prozentsatz} = ${quotient}`,
        result: quotient,
      },
      {
        label: 'Multiplikation',
        formula: `${quotient} × 100 = ${primaryResult}`,
        result: primaryResult,
      },
    ],
    formulaGeneral: FORMULA_GENERAL,
    formulaWithValues: `G = ${prozentwert} / ${prozentsatz} × 100`,
    warnings: [],
  };
}

export const grundwertMode: CalculatorMode = {
  id: 'grundwert',
  path: '/grundwert',
  labelKey: 'inputs.grundwert',
  inputFields: [
    {
      name: 'prozentwert',
      labelKey: 'inputs.prozentwert',
      suffix: '€',
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
      name: 'grundwert',
      labelKey: 'inputs.grundwert',
      suffix: '€',
      isPrimary: true,
    },
  ],
  calculate: calculateGrundwert,
};
