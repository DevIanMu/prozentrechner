import type {
  CalculationResult,
  CalculatorMode,
  InputMap,
} from '@/lib/calculations/types';

const FORMULA_GENERAL = 'R = G × p / 100';

export function calculateRabatt(inputs: InputMap): CalculationResult {
  const preis = inputs.preis ?? null;
  const rabatt = inputs.rabatt ?? null;

  if (preis === null || rabatt === null) {
    return {
      inputs: { preis, rabatt },
      primaryResult: null,
      secondaryResults: { endpreis: null },
      steps: [],
      formulaGeneral: FORMULA_GENERAL,
      formulaWithValues: FORMULA_GENERAL,
      warnings: [],
    };
  }

  const product = preis * rabatt;
  const primaryResult = product / 100;
  const endpreis = preis - primaryResult;

  return {
    inputs: { preis, rabatt },
    primaryResult,
    secondaryResults: { endpreis },
    steps: [
      {
        label: 'Multiplikation',
        formula: `${preis} × ${rabatt} = ${product}`,
        result: product,
      },
      {
        label: 'Division',
        formula: `${product} / 100 = ${primaryResult}`,
        result: primaryResult,
      },
    ],
    formulaGeneral: FORMULA_GENERAL,
    formulaWithValues: `R = ${preis} × ${rabatt} / 100`,
    warnings: [],
  };
}

export const rabattMode: CalculatorMode = {
  id: 'rabatt-berechnen',
  path: '/rabatt-berechnen',
  labelKey: 'inputs.rabatt',
  inputFields: [
    {
      name: 'preis',
      labelKey: 'inputs.preis',
      suffix: '€',
      inputmode: 'decimal',
    },
    {
      name: 'rabatt',
      labelKey: 'inputs.rabatt',
      suffix: '%',
      inputmode: 'decimal',
    },
  ],
  resultLabels: [
    {
      name: 'rabatt',
      labelKey: 'inputs.rabatt',
      suffix: '€',
      isPrimary: true,
    },
    {
      name: 'endpreis',
      labelKey: 'inputs.endpreis',
      suffix: '€',
    },
  ],
  calculate: calculateRabatt,
};
