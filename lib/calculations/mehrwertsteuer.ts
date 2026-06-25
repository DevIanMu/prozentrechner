import type {
  CalculationResult,
  CalculatorMode,
  InputMap,
} from '@/lib/calculations/types';

const FORMULA_GENERAL = 'MwSt = brutto × satz / (100 + satz)';

export function calculateMehrwertsteuer(inputs: InputMap): CalculationResult {
  const brutto = inputs.brutto ?? null;
  const satz = inputs.satz ?? null;

  if (brutto === null || satz === null) {
    return {
      inputs: { brutto, satz },
      primaryResult: null,
      secondaryResults: {},
      steps: [],
      formulaGeneral: FORMULA_GENERAL,
      formulaWithValues: FORMULA_GENERAL,
      warnings: [],
    };
  }

  if (brutto < 0) {
    return {
      inputs: { brutto, satz },
      primaryResult: null,
      secondaryResults: { netto: null },
      steps: [],
      formulaGeneral: FORMULA_GENERAL,
      formulaWithValues: FORMULA_GENERAL,
      warnings: ['Negative Eingaben sind nicht zulässig.'],
    };
  }

  const denominator = 100 + satz;
  const primaryResult = (brutto * satz) / denominator;
  const netto = brutto - primaryResult;

  return {
    inputs: { brutto, satz },
    primaryResult,
    secondaryResults: { netto },
    steps: [
      {
        label: 'Nenner',
        formula: `100 + ${satz} = ${denominator}`,
        result: denominator,
      },
      {
        label: 'MwSt-Berechnung',
        formula: `${brutto} × ${satz} / ${denominator} = ${primaryResult}`,
        result: primaryResult,
      },
      {
        label: 'Netto',
        formula: `${brutto} - ${primaryResult} = ${netto}`,
        result: netto,
      },
    ],
    formulaGeneral: FORMULA_GENERAL,
    formulaWithValues: `MwSt = ${brutto} × ${satz} / (100 + ${satz})`,
    warnings: [],
  };
}

export const mehrwertsteuerMode: CalculatorMode = {
  id: 'mehrwertsteuer',
  path: '/mehrwertsteuer',
  labelKey: 'calculator.inputs.mehrwertsteuer',
  inputFields: [
    {
      name: 'brutto',
      labelKey: 'calculator.inputs.brutto',
      suffix: '€',
      inputmode: 'decimal',
    },
    {
      name: 'satz',
      labelKey: 'calculator.inputs.satz',
      suffix: '%',
      inputmode: 'decimal',
    },
  ],
  resultLabels: [
    {
      name: 'mwst',
      labelKey: 'calculator.inputs.mehrwertsteuer',
      suffix: '€',
      isPrimary: true,
    },
    {
      name: 'netto',
      labelKey: 'calculator.inputs.netto',
      suffix: '€',
    },
  ],
  calculate: calculateMehrwertsteuer,
};
