import { describe, it, expect } from 'vitest';
import {
  calculateProzentsatz,
  prozentsatzMode,
} from '@/lib/calculations/prozentsatz';

describe('calculateProzentsatz', () => {
  it('calculates 100 of 500 as 20%', () => {
    const result = calculateProzentsatz({
      prozentwert: 100,
      grundwert: 500,
    });

    expect(result.primaryResult).toBe(20);
    expect(result.inputs).toEqual({ prozentwert: 100, grundwert: 500 });
    expect(result.warnings).toEqual([]);
  });

  it('returns null primaryResult when any input is missing', () => {
    expect(
      calculateProzentsatz({ prozentwert: 100, grundwert: null }).primaryResult
    ).toBeNull();
    expect(
      calculateProzentsatz({ prozentwert: null, grundwert: 500 }).primaryResult
    ).toBeNull();
    expect(
      calculateProzentsatz({ prozentwert: null, grundwert: null }).primaryResult
    ).toBeNull();
  });

  it('returns null and a warning when grundwert is zero', () => {
    const result = calculateProzentsatz({
      prozentwert: 100,
      grundwert: 0,
    });

    expect(result.primaryResult).toBeNull();
    expect(result.warnings).toEqual(['Division durch Null nicht möglich.']);
    expect(result.steps).toEqual([]);
  });

  it('includes a step-by-step breakdown with expected formulas and values', () => {
    const result = calculateProzentsatz({
      prozentwert: 100,
      grundwert: 500,
    });

    expect(result.steps).toHaveLength(2);
    expect(result.steps[0]).toMatchObject({
      label: 'Division',
      formula: '100 / 500 = 0.2',
      result: 0.2,
    });
    expect(result.steps[1]).toMatchObject({
      label: 'Multiplikation',
      formula: '0.2 × 100 = 20',
      result: 20,
    });
  });

  it('provides the general and value-substituted formulas', () => {
    const result = calculateProzentsatz({
      prozentwert: 100,
      grundwert: 500,
    });

    expect(result.formulaGeneral).toBe('p% = W / G × 100');
    expect(result.formulaWithValues).toBe('p% = 100 / 500 × 100');
  });

  it('uses default placeholders when inputs are missing', () => {
    const result = calculateProzentsatz({
      prozentwert: null,
      grundwert: null,
    });

    expect(result.formulaGeneral).toBe('p% = W / G × 100');
    expect(result.formulaWithValues).toBe('p% = W / G × 100');
    expect(result.steps).toEqual([]);
  });
});

describe('prozentsatzMode', () => {
  it('has two input fields named prozentwert and grundwert', () => {
    expect(prozentsatzMode.inputFields).toHaveLength(2);
    expect(prozentsatzMode.inputFields.map((f) => f.name)).toEqual([
      'prozentwert',
      'grundwert',
    ]);
  });

  it('has one primary result label named prozentsatz', () => {
    expect(prozentsatzMode.resultLabels).toHaveLength(1);
    expect(prozentsatzMode.resultLabels[0].name).toBe('prozentsatz');
    expect(prozentsatzMode.resultLabels[0].isPrimary).toBe(true);
  });

  it('uses correct labels, suffixes and calculate binding', () => {
    expect(prozentsatzMode.id).toBe('prozentsatz');
    expect(prozentsatzMode.path).toBe('/prozentsatz');
    expect(prozentsatzMode.labelKey).toBe('calculator.inputs.prozentsatz');
    expect(prozentsatzMode.inputFields[0]).toMatchObject({
      name: 'prozentwert',
      labelKey: 'calculator.inputs.prozentwert',
      suffix: '€',
    });
    expect(prozentsatzMode.inputFields[1]).toMatchObject({
      name: 'grundwert',
      labelKey: 'calculator.inputs.grundwert',
      suffix: '€',
    });
    expect(prozentsatzMode.resultLabels[0]).toMatchObject({
      name: 'prozentsatz',
      labelKey: 'calculator.inputs.prozentsatz',
      suffix: '%',
      isPrimary: true,
    });
    expect(prozentsatzMode.calculate).toBe(calculateProzentsatz);
  });
});
