import { describe, it, expect } from 'vitest';
import {
  calculateAbzunahme,
  abzunahmeMode,
} from '@/lib/calculations/abzunahme';

describe('calculateAbzunahme', () => {
  it('calculates 80 + 7% as 85.6', () => {
    const result = calculateAbzunahme({
      ausgangswert: 80,
      prozentsatz: 7,
    });

    expect(result.primaryResult).toBeCloseTo(85.6, 10);
    expect(result.inputs).toEqual({ ausgangswert: 80, prozentsatz: 7 });
    expect(result.warnings).toEqual([]);
  });

  it('calculates 80 - 7% as 74.4', () => {
    const result = calculateAbzunahme({
      ausgangswert: 80,
      prozentsatz: -7,
    });

    expect(result.primaryResult).toBeCloseTo(74.4, 10);
    expect(result.inputs).toEqual({ ausgangswert: 80, prozentsatz: -7 });
    expect(result.warnings).toEqual([]);
  });

  it('returns null primaryResult when any input is missing', () => {
    expect(
      calculateAbzunahme({ ausgangswert: 80, prozentsatz: null }).primaryResult
    ).toBeNull();
    expect(
      calculateAbzunahme({ ausgangswert: null, prozentsatz: 7 }).primaryResult
    ).toBeNull();
    expect(
      calculateAbzunahme({ ausgangswert: null, prozentsatz: null }).primaryResult
    ).toBeNull();
  });

  it('includes a step-by-step breakdown with expected formulas and values', () => {
    const result = calculateAbzunahme({
      ausgangswert: 80,
      prozentsatz: 7,
    });

    expect(result.steps).toHaveLength(3);
    expect(result.steps[0]).toMatchObject({
      label: 'Prozentsatz als Bruch',
      formula: '7 / 100 = 0.07',
      result: 0.07,
    });
    expect(result.steps[1]).toMatchObject({
      label: 'Veränderungsfaktor',
      formula: '1 + 0.07 = 1.07',
      result: 1.07,
    });
    expect(result.steps[2].label).toBe('Multiplikation');
    expect(result.steps[2].result).toBeCloseTo(85.6, 10);
  });

  it('provides the general and value-substituted formulas', () => {
    const result = calculateAbzunahme({
      ausgangswert: 80,
      prozentsatz: 7,
    });

    expect(result.formulaGeneral).toBe('E = G × (1 + p / 100)');
    expect(result.formulaWithValues).toBe('E = 80 × (1 + 7 / 100)');
  });

  it('uses default placeholders when inputs are missing', () => {
    const result = calculateAbzunahme({
      ausgangswert: null,
      prozentsatz: null,
    });

    expect(result.formulaGeneral).toBe('E = G × (1 + p / 100)');
    expect(result.formulaWithValues).toBe('E = G × (1 + p / 100)');
    expect(result.steps).toEqual([]);
  });
});

describe('abzunahmeMode', () => {
  it('has two input fields named ausgangswert and prozentsatz', () => {
    expect(abzunahmeMode.inputFields).toHaveLength(2);
    expect(abzunahmeMode.inputFields.map((f) => f.name)).toEqual([
      'ausgangswert',
      'prozentsatz',
    ]);
  });

  it('has one primary result label named ergebnis', () => {
    expect(abzunahmeMode.resultLabels).toHaveLength(1);
    expect(abzunahmeMode.resultLabels[0].name).toBe('ergebnis');
    expect(abzunahmeMode.resultLabels[0].isPrimary).toBe(true);
  });

  it('uses correct labels, suffixes and calculate binding', () => {
    expect(abzunahmeMode.id).toBe('abzunahme');
    expect(abzunahmeMode.path).toBe('/abzunahme');
    expect(abzunahmeMode.labelKey).toBe('calculator.inputs.abzunahme');
    expect(abzunahmeMode.inputFields[0]).toMatchObject({
      name: 'ausgangswert',
      labelKey: 'calculator.inputs.ausgangswert',
    });
    expect(abzunahmeMode.inputFields[1]).toMatchObject({
      name: 'prozentsatz',
      labelKey: 'calculator.inputs.prozentsatz',
      suffix: '%',
    });
    expect(abzunahmeMode.resultLabels[0]).toMatchObject({
      name: 'ergebnis',
      labelKey: 'calculator.inputs.ergebnis',
      isPrimary: true,
    });
    expect(abzunahmeMode.calculate).toBe(calculateAbzunahme);
  });
});
