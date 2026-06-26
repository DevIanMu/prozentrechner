import type {
  CalculationResult,
  CalculatorMode,
  InputMap,
} from '@/lib/calculations/types';

const FORMULA_GENERAL = 'W = G × p / 100';

export function calculateProzentwert(inputs: InputMap): CalculationResult {
  const grundwert = inputs.grundwert ?? null;
  const prozentsatz = inputs.prozentsatz ?? null;

  if (grundwert === null || prozentsatz === null) {
    return {
      inputs: { grundwert, prozentsatz },
      primaryResult: null,
      steps: [],
      formulaGeneral: FORMULA_GENERAL,
      formulaWithValues: FORMULA_GENERAL,
      warnings: [],
    };
  }

  const product = grundwert * prozentsatz;
  const primaryResult = product / 100;

  return {
    inputs: { grundwert, prozentsatz },
    primaryResult,
    steps: [
      {
        label: 'Multiplikation',
        formula: `${grundwert} × ${prozentsatz} = ${product}`,
        result: product,
      },
      {
        label: 'Division',
        formula: `${product} / 100 = ${primaryResult}`,
        result: primaryResult,
      },
    ],
    formulaGeneral: FORMULA_GENERAL,
    formulaWithValues: `W = ${grundwert} × ${prozentsatz} / 100`,
    warnings: [],
  };
}

export const prozentwertMode: CalculatorMode = {
  id: 'prozentwert',
  path: '/prozentwert',
  labelKey: 'inputs.prozentwert',
  inputFields: [
    {
      name: 'grundwert',
      labelKey: 'inputs.grundwert',
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
      name: 'prozentwert',
      labelKey: 'inputs.prozentwert',
      suffix: '€',
      isPrimary: true,
    },
  ],
  calculate: calculateProzentwert,
};
