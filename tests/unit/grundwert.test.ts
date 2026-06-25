import { describe, it, expect } from 'vitest';
import {
  calculateGrundwert,
  grundwertMode,
} from '@/lib/calculations/grundwert';

describe('calculateGrundwert', () => {
  it('calculates 20% of G = 100 as G = 500', () => {
    const result = calculateGrundwert({
      prozentwert: 100,
      prozentsatz: 20,
    });

    expect(result.primaryResult).toBe(500);
    expect(result.inputs).toEqual({ prozentwert: 100, prozentsatz: 20 });
    expect(result.warnings).toEqual([]);
  });

  it('returns null primaryResult when any input is missing', () => {
    expect(
      calculateGrundwert({ prozentwert: 100, prozentsatz: null }).primaryResult
    ).toBeNull();
    expect(
      calculateGrundwert({ prozentwert: null, prozentsatz: 20 }).primaryResult
    ).toBeNull();
    expect(
      calculateGrundwert({ prozentwert: null, prozentsatz: null }).primaryResult
    ).toBeNull();
  });

  it('returns null and a warning when prozentsatz is 0', () => {
    const result = calculateGrundwert({
      prozentwert: 100,
      prozentsatz: 0,
    });

    expect(result.primaryResult).toBeNull();
    expect(result.warnings).toContain('Division durch Null nicht möglich.');
  });

  it('includes a step-by-step breakdown with expected formulas and values', () => {
    const result = calculateGrundwert({
      prozentwert: 100,
      prozentsatz: 20,
    });

    expect(result.steps).toHaveLength(2);
    expect(result.steps[0]).toMatchObject({
      label: 'Division',
      formula: '100 / 20 = 5',
      result: 5,
    });
    expect(result.steps[1]).toMatchObject({
      label: 'Multiplikation',
      formula: '5 × 100 = 500',
      result: 500,
    });
  });

  it('provides the general and value-substituted formulas', () => {
    const result = calculateGrundwert({
      prozentwert: 100,
      prozentsatz: 20,
    });

    expect(result.formulaGeneral).toBe('G = W / p × 100');
    expect(result.formulaWithValues).toBe('G = 100 / 20 × 100');
  });

  it('uses default placeholders when inputs are missing', () => {
    const result = calculateGrundwert({
      prozentwert: null,
      prozentsatz: null,
    });

    expect(result.formulaGeneral).toBe('G = W / p × 100');
    expect(result.formulaWithValues).toBe('G = W / p × 100');
    expect(result.steps).toEqual([]);
  });
});

describe('grundwertMode', () => {
  it('has two input fields named prozentwert and prozentsatz', () => {
    expect(grundwertMode.inputFields).toHaveLength(2);
    expect(grundwertMode.inputFields.map((f) => f.name)).toEqual([
      'prozentwert',
      'prozentsatz',
    ]);
  });

  it('has one primary result label named grundwert', () => {
    expect(grundwertMode.resultLabels).toHaveLength(1);
    expect(grundwertMode.resultLabels[0].name).toBe('grundwert');
    expect(grundwertMode.resultLabels[0].isPrimary).toBe(true);
  });

  it('uses correct labels, suffixes and calculate binding', () => {
    expect(grundwertMode.id).toBe('grundwert');
    expect(grundwertMode.path).toBe('/grundwert');
    expect(grundwertMode.labelKey).toBe('calculator.inputs.grundwert');
    expect(grundwertMode.inputFields[0]).toMatchObject({
      name: 'prozentwert',
      labelKey: 'calculator.inputs.prozentwert',
      suffix: '€',
    });
    expect(grundwertMode.inputFields[1]).toMatchObject({
      name: 'prozentsatz',
      labelKey: 'calculator.inputs.prozentsatz',
      suffix: '%',
    });
    expect(grundwertMode.resultLabels[0]).toMatchObject({
      name: 'grundwert',
      labelKey: 'calculator.inputs.grundwert',
      suffix: '€',
      isPrimary: true,
    });
    expect(grundwertMode.calculate).toBe(calculateGrundwert);
  });
});
