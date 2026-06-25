import { describe, it, expect } from 'vitest';
import { calculateRabatt, rabattMode } from '@/lib/calculations/rabatt';

describe('calculateRabatt', () => {
  it('calculates 20% discount on 70 as Rabatt 14 and Endpreis 56', () => {
    const result = calculateRabatt({
      preis: 70,
      rabatt: 20,
    });

    expect(result.primaryResult).toBe(14);
    expect(result.secondaryResults).toEqual({ endpreis: 56 });
    expect(result.inputs).toEqual({ preis: 70, rabatt: 20 });
    expect(result.warnings).toEqual([]);
  });

  it('returns null primaryResult and null secondaryResults when any input is missing', () => {
    expect(
      calculateRabatt({ preis: 70, rabatt: null }).primaryResult
    ).toBeNull();
    expect(
      calculateRabatt({ preis: 70, rabatt: null }).secondaryResults
    ).toEqual({ endpreis: null });
    expect(
      calculateRabatt({ preis: null, rabatt: 20 }).primaryResult
    ).toBeNull();
    expect(
      calculateRabatt({ preis: null, rabatt: 20 }).secondaryResults
    ).toEqual({ endpreis: null });
    expect(
      calculateRabatt({ preis: null, rabatt: null }).primaryResult
    ).toBeNull();
    expect(
      calculateRabatt({ preis: null, rabatt: null }).secondaryResults
    ).toEqual({ endpreis: null });
  });

  it('includes a step-by-step breakdown with expected formulas and values', () => {
    const result = calculateRabatt({
      preis: 70,
      rabatt: 20,
    });

    expect(result.steps).toHaveLength(2);
    expect(result.steps[0]).toMatchObject({
      label: 'Multiplikation',
      formula: '70 × 20 = 1400',
      result: 1400,
    });
    expect(result.steps[1]).toMatchObject({
      label: 'Division',
      formula: '1400 / 100 = 14',
      result: 14,
    });
  });

  it('provides the general and value-substituted formulas', () => {
    const result = calculateRabatt({
      preis: 70,
      rabatt: 20,
    });

    expect(result.formulaGeneral).toBe('R = G × p / 100');
    expect(result.formulaWithValues).toBe('R = 70 × 20 / 100');
  });

  it('uses default placeholders when inputs are missing', () => {
    const result = calculateRabatt({
      preis: null,
      rabatt: null,
    });

    expect(result.formulaGeneral).toBe('R = G × p / 100');
    expect(result.formulaWithValues).toBe('R = G × p / 100');
    expect(result.steps).toEqual([]);
  });
});

describe('rabattMode', () => {
  it('has two input fields named preis and rabatt', () => {
    expect(rabattMode.inputFields).toHaveLength(2);
    expect(rabattMode.inputFields.map((f) => f.name)).toEqual([
      'preis',
      'rabatt',
    ]);
  });

  it('has a primary result label named rabatt and a secondary result label named endpreis', () => {
    expect(rabattMode.resultLabels).toHaveLength(2);
    expect(rabattMode.resultLabels[0].name).toBe('rabatt');
    expect(rabattMode.resultLabels[0].isPrimary).toBe(true);
    expect(rabattMode.resultLabels[1].name).toBe('endpreis');
    expect(rabattMode.resultLabels[1].isPrimary).toBeUndefined();
  });

  it('uses correct labels, suffixes and calculate binding', () => {
    expect(rabattMode.id).toBe('rabatt-berechnen');
    expect(rabattMode.path).toBe('/rabatt-berechnen');
    expect(rabattMode.labelKey).toBe('calculator.inputs.rabatt');
    expect(rabattMode.inputFields[0]).toMatchObject({
      name: 'preis',
      labelKey: 'calculator.inputs.preis',
      suffix: '€',
    });
    expect(rabattMode.inputFields[1]).toMatchObject({
      name: 'rabatt',
      labelKey: 'calculator.inputs.rabatt',
      suffix: '%',
    });
    expect(rabattMode.resultLabels[0]).toMatchObject({
      name: 'rabatt',
      labelKey: 'calculator.inputs.rabatt',
      suffix: '€',
      isPrimary: true,
    });
    expect(rabattMode.resultLabels[1]).toMatchObject({
      name: 'endpreis',
      labelKey: 'calculator.inputs.endpreis',
      suffix: '€',
    });
    expect(rabattMode.calculate).toBe(calculateRabatt);
  });
});
