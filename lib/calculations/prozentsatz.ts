import type {
  CalculationResult,
  CalculatorMode,
  InputMap,
} from '@/lib/calculations/types';

const FORMULA_GENERAL = 'p% = W / G × 100';

export function calculateProzentsatz(inputs: InputMap): CalculationResult {
  const prozentwert = inputs.prozentwert ?? null;
  const grundwert = inputs.grundwert ?? null;

  if (prozentwert === null || grundwert === null) {
    return {
      inputs: { prozentwert, grundwert },
      primaryResult: null,
      steps: [],
      formulaGeneral: FORMULA_GENERAL,
      formulaWithValues: FORMULA_GENERAL,
      warnings: [],
    };
  }

  if (grundwert === 0) {
    return {
      inputs: { prozentwert, grundwert },
      primaryResult: null,
      steps: [],
      formulaGeneral: FORMULA_GENERAL,
      formulaWithValues: FORMULA_GENERAL,
      warnings: ['Division durch Null nicht möglich.'],
    };
  }

  const quotient = prozentwert / grundwert;
  const primaryResult = quotient * 100;

  return {
    inputs: { prozentwert, grundwert },
    primaryResult,
    steps: [
      {
        label: 'Division',
        formula: `${prozentwert} / ${grundwert} = ${quotient}`,
        result: quotient,
      },
      {
        label: 'Multiplikation',
        formula: `${quotient} × 100 = ${primaryResult}`,
        result: primaryResult,
      },
    ],
    formulaGeneral: FORMULA_GENERAL,
    formulaWithValues: `p% = ${prozentwert} / ${grundwert} × 100`,
    warnings: [],
  };
}

export const prozentsatzMode: CalculatorMode = {
  id: 'prozentsatz',
  path: '/prozentsatz',
  labelKey: 'calculator.inputs.prozentsatz',
  inputFields: [
    {
      name: 'prozentwert',
      labelKey: 'calculator.inputs.prozentwert',
      suffix: '€',
      inputmode: 'decimal',
    },
    {
      name: 'grundwert',
      labelKey: 'calculator.inputs.grundwert',
      suffix: '€',
      inputmode: 'decimal',
    },
  ],
  resultLabels: [
    {
      name: 'prozentsatz',
      labelKey: 'calculator.inputs.prozentsatz',
      suffix: '%',
      isPrimary: true,
    },
  ],
  calculate: calculateProzentsatz,
};
