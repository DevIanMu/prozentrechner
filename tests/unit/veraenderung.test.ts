import { describe, it, expect } from 'vitest';
import {
  calculateVeraenderung,
  veraenderungMode,
} from '@/lib/calculations/veraenderung';

describe('calculateVeraenderung', () => {
  it('calculates 80 to 100 as 25%', () => {
    const result = calculateVeraenderung({
      alterWert: 80,
      neuerWert: 100,
    });

    expect(result.primaryResult).toBe(25);
    expect(result.inputs).toEqual({ alterWert: 80, neuerWert: 100 });
    expect(result.warnings).toEqual([]);
  });

  it('calculates 100 to 80 as -20%', () => {
    const result = calculateVeraenderung({
      alterWert: 100,
      neuerWert: 80,
    });

    expect(result.primaryResult).toBe(-20);
    expect(result.inputs).toEqual({ alterWert: 100, neuerWert: 80 });
    expect(result.warnings).toEqual([]);
  });

  it('returns null primaryResult and a warning when alterWert is 0', () => {
    const result = calculateVeraenderung({
      alterWert: 0,
      neuerWert: 100,
    });

    expect(result.primaryResult).toBeNull();
    expect(result.warnings).toEqual(['Division durch Null nicht möglich.']);
    expect(result.steps).toEqual([]);
  });

  it('returns null primaryResult when any input is missing', () => {
    expect(
      calculateVeraenderung({ alterWert: 80, neuerWert: null }).primaryResult
    ).toBeNull();
    expect(
      calculateVeraenderung({ alterWert: null, neuerWert: 100 }).primaryResult
    ).toBeNull();
    expect(
      calculateVeraenderung({ alterWert: null, neuerWert: null }).primaryResult
    ).toBeNull();
  });

  it('includes a step-by-step breakdown with expected formulas and values', () => {
    const result = calculateVeraenderung({
      alterWert: 80,
      neuerWert: 100,
    });

    expect(result.steps).toHaveLength(3);
    expect(result.steps[0]).toMatchObject({
      label: 'Differenz',
      formula: '100 - 80 = 20',
      result: 20,
    });
    expect(result.steps[1]).toMatchObject({
      label: 'Division',
      formula: '20 / 80 = 0.25',
      result: 0.25,
    });
    expect(result.steps[2]).toMatchObject({
      label: 'Multiplikation',
      formula: '0.25 × 100 = 25',
      result: 25,
    });
  });

  it('provides the general and value-substituted formulas', () => {
    const result = calculateVeraenderung({
      alterWert: 80,
      neuerWert: 100,
    });

    expect(result.formulaGeneral).toBe('p% = (W₂ - W₁) / W₁ × 100');
    expect(result.formulaWithValues).toBe('p% = (100 - 80) / 80 × 100');
  });

  it('uses default placeholders when inputs are missing', () => {
    const result = calculateVeraenderung({
      alterWert: null,
      neuerWert: null,
    });

    expect(result.formulaGeneral).toBe('p% = (W₂ - W₁) / W₁ × 100');
    expect(result.formulaWithValues).toBe('p% = (W₂ - W₁) / W₁ × 100');
    expect(result.steps).toEqual([]);
  });
});

describe('veraenderungMode', () => {
  it('has two input fields named alterWert and neuerWert', () => {
    expect(veraenderungMode.inputFields).toHaveLength(2);
    expect(veraenderungMode.inputFields.map((f) => f.name)).toEqual([
      'alterWert',
      'neuerWert',
    ]);
  });

  it('has one primary result label named prozentualeVeraenderung', () => {
    expect(veraenderungMode.resultLabels).toHaveLength(1);
    expect(veraenderungMode.resultLabels[0].name).toBe(
      'prozentualeVeraenderung'
    );
    expect(veraenderungMode.resultLabels[0].isPrimary).toBe(true);
  });

  it('uses correct labels, suffixes and calculate binding', () => {
    expect(veraenderungMode.id).toBe('prozentuale-veraenderung');
    expect(veraenderungMode.path).toBe('/prozentuale-veraenderung');
    expect(veraenderungMode.labelKey).toBe(
      'calculator.inputs.prozentualeVeraenderung'
    );
    expect(veraenderungMode.inputFields[0]).toMatchObject({
      name: 'alterWert',
      labelKey: 'calculator.inputs.alterWert',
    });
    expect(veraenderungMode.inputFields[1]).toMatchObject({
      name: 'neuerWert',
      labelKey: 'calculator.inputs.neuerWert',
    });
    expect(veraenderungMode.resultLabels[0]).toMatchObject({
      name: 'prozentualeVeraenderung',
      labelKey: 'calculator.inputs.prozentualeVeraenderung',
      suffix: '%',
      isPrimary: true,
    });
    expect(veraenderungMode.calculate).toBe(calculateVeraenderung);
  });
});
