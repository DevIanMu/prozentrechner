import { describe, it, expect } from 'vitest';
import {
  calculateProzentwert,
  prozentwertMode,
} from '@/lib/calculations/prozentwert';

describe('calculateProzentwert', () => {
  it('calculates 20% of 500 as 100', () => {
    const result = calculateProzentwert({
      grundwert: 500,
      prozentsatz: 20,
    });

    expect(result.primaryResult).toBe(100);
    expect(result.inputs).toEqual({ grundwert: 500, prozentsatz: 20 });
    expect(result.warnings).toEqual([]);
  });

  it('returns null primaryResult when any input is missing', () => {
    expect(
      calculateProzentwert({ grundwert: 500, prozentsatz: null }).primaryResult
    ).toBeNull();
    expect(
      calculateProzentwert({ grundwert: null, prozentsatz: 20 }).primaryResult
    ).toBeNull();
    expect(
      calculateProzentwert({ grundwert: null, prozentsatz: null }).primaryResult
    ).toBeNull();
  });

  it('includes a step-by-step breakdown with expected formulas and values', () => {
    const result = calculateProzentwert({
      grundwert: 500,
      prozentsatz: 20,
    });

    expect(result.steps).toHaveLength(2);
    expect(result.steps[0]).toMatchObject({
      label: 'Multiplikation',
      formula: '500 × 20 = 10000',
      result: 10000,
    });
    expect(result.steps[1]).toMatchObject({
      label: 'Division',
      formula: '10000 / 100 = 100',
      result: 100,
    });
  });

  it('provides the general and value-substituted formulas', () => {
    const result = calculateProzentwert({
      grundwert: 500,
      prozentsatz: 20,
    });

    expect(result.formulaGeneral).toBe('W = G × p / 100');
    expect(result.formulaWithValues).toBe('W = 500 × 20 / 100');
  });

  it('uses default placeholders when inputs are missing', () => {
    const result = calculateProzentwert({
      grundwert: null,
      prozentsatz: null,
    });

    expect(result.formulaGeneral).toBe('W = G × p / 100');
    expect(result.formulaWithValues).toBe('W = G × p / 100');
    expect(result.steps).toEqual([]);
  });
});

describe('prozentwertMode', () => {
  it('has two input fields named grundwert and prozentsatz', () => {
    expect(prozentwertMode.inputFields).toHaveLength(2);
    expect(prozentwertMode.inputFields.map((f) => f.name)).toEqual([
      'grundwert',
      'prozentsatz',
    ]);
  });

  it('has one primary result label named prozentwert', () => {
    expect(prozentwertMode.resultLabels).toHaveLength(1);
    expect(prozentwertMode.resultLabels[0].name).toBe('prozentwert');
    expect(prozentwertMode.resultLabels[0].isPrimary).toBe(true);
  });

  it('uses correct labels, suffixes and calculate binding', () => {
    expect(prozentwertMode.id).toBe('prozentwert');
    expect(prozentwertMode.path).toBe('/prozentwert');
    expect(prozentwertMode.labelKey).toBe('inputs.prozentwert');
    expect(prozentwertMode.inputFields[0]).toMatchObject({
      name: 'grundwert',
      labelKey: 'inputs.grundwert',
      suffix: '€',
    });
    expect(prozentwertMode.inputFields[1]).toMatchObject({
      name: 'prozentsatz',
      labelKey: 'inputs.prozentsatz',
      suffix: '%',
    });
    expect(prozentwertMode.resultLabels[0]).toMatchObject({
      name: 'prozentwert',
      labelKey: 'inputs.prozentwert',
      suffix: '€',
      isPrimary: true,
    });
    expect(prozentwertMode.calculate).toBe(calculateProzentwert);
  });
});
