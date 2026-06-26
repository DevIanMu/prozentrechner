import { describe, it, expect } from 'vitest';
import {
  calculateMehrwertsteuer,
  mehrwertsteuerMode,
} from '@/lib/calculations/mehrwertsteuer';

describe('calculateMehrwertsteuer', () => {
  it('calculates 119 brutto at 19% as MwSt 19 and Netto 100', () => {
    const result = calculateMehrwertsteuer({
      brutto: 119,
      satz: 19,
    });

    expect(result.primaryResult).toBe(19);
    expect(result.secondaryResults).toEqual({ netto: 100 });
    expect(result.inputs).toEqual({ brutto: 119, satz: 19 });
    expect(result.warnings).toEqual([]);
  });

  it('calculates 107 brutto at 7% as MwSt 7 and Netto 100', () => {
    const result = calculateMehrwertsteuer({
      brutto: 107,
      satz: 7,
    });

    expect(result.primaryResult).toBe(7);
    expect(result.secondaryResults).toEqual({ netto: 100 });
    expect(result.inputs).toEqual({ brutto: 107, satz: 7 });
    expect(result.warnings).toEqual([]);
  });

  it('returns null primaryResult and a warning when brutto is negative', () => {
    const result = calculateMehrwertsteuer({
      brutto: -100,
      satz: 19,
    });

    expect(result.primaryResult).toBeNull();
    expect(result.secondaryResults).toEqual({ netto: null });
    expect(result.warnings).toEqual([
      'Negative Eingaben sind nicht zulässig.',
    ]);
  });

  it('returns null primaryResult and empty secondaryResults when any input is missing', () => {
    expect(
      calculateMehrwertsteuer({ brutto: 119, satz: null }).primaryResult
    ).toBeNull();
    expect(
      calculateMehrwertsteuer({ brutto: 119, satz: null }).secondaryResults
    ).toEqual({});
    expect(
      calculateMehrwertsteuer({ brutto: null, satz: 19 }).primaryResult
    ).toBeNull();
    expect(
      calculateMehrwertsteuer({ brutto: null, satz: 19 }).secondaryResults
    ).toEqual({});
    expect(
      calculateMehrwertsteuer({ brutto: null, satz: null }).primaryResult
    ).toBeNull();
    expect(
      calculateMehrwertsteuer({ brutto: null, satz: null }).secondaryResults
    ).toEqual({});
  });

  it('includes a step-by-step breakdown with expected formulas and values', () => {
    const result = calculateMehrwertsteuer({
      brutto: 119,
      satz: 19,
    });

    expect(result.steps).toHaveLength(3);
    expect(result.steps[0]).toMatchObject({
      label: 'Nenner',
      formula: '100 + 19 = 119',
      result: 119,
    });
    expect(result.steps[1]).toMatchObject({
      label: 'MwSt-Berechnung',
      formula: '119 × 19 / 119 = 19',
      result: 19,
    });
    expect(result.steps[2]).toMatchObject({
      label: 'Netto',
      formula: '119 - 19 = 100',
      result: 100,
    });
  });

  it('provides the general and value-substituted formulas', () => {
    const result = calculateMehrwertsteuer({
      brutto: 119,
      satz: 19,
    });

    expect(result.formulaGeneral).toBe(
      'MwSt = brutto × satz / (100 + satz)'
    );
    expect(result.formulaWithValues).toBe(
      'MwSt = 119 × 19 / (100 + 19)'
    );
  });

  it('uses default placeholders when inputs are missing', () => {
    const result = calculateMehrwertsteuer({
      brutto: null,
      satz: null,
    });

    expect(result.formulaGeneral).toBe(
      'MwSt = brutto × satz / (100 + satz)'
    );
    expect(result.formulaWithValues).toBe(
      'MwSt = brutto × satz / (100 + satz)'
    );
    expect(result.steps).toEqual([]);
  });
});

describe('mehrwertsteuerMode', () => {
  it('has two input fields named brutto and satz', () => {
    expect(mehrwertsteuerMode.inputFields).toHaveLength(2);
    expect(mehrwertsteuerMode.inputFields.map((f) => f.name)).toEqual([
      'brutto',
      'satz',
    ]);
  });

  it('has a primary result label named mwst and a secondary result label named netto', () => {
    expect(mehrwertsteuerMode.resultLabels).toHaveLength(2);
    expect(mehrwertsteuerMode.resultLabels[0].name).toBe('mwst');
    expect(mehrwertsteuerMode.resultLabels[0].isPrimary).toBe(true);
    expect(mehrwertsteuerMode.resultLabels[1].name).toBe('netto');
    expect(mehrwertsteuerMode.resultLabels[1].isPrimary).toBeUndefined();
  });

  it('uses correct labels, suffixes and calculate binding', () => {
    expect(mehrwertsteuerMode.id).toBe('mehrwertsteuer');
    expect(mehrwertsteuerMode.path).toBe('/mehrwertsteuer');
    expect(mehrwertsteuerMode.labelKey).toBe(
      'inputs.mehrwertsteuer'
    );
    expect(mehrwertsteuerMode.inputFields[0]).toMatchObject({
      name: 'brutto',
      labelKey: 'inputs.brutto',
      suffix: '€',
    });
    expect(mehrwertsteuerMode.inputFields[1]).toMatchObject({
      name: 'satz',
      labelKey: 'inputs.satz',
      suffix: '%',
    });
    expect(mehrwertsteuerMode.resultLabels[0]).toMatchObject({
      name: 'mwst',
      labelKey: 'inputs.mehrwertsteuer',
      suffix: '€',
      isPrimary: true,
    });
    expect(mehrwertsteuerMode.resultLabels[1]).toMatchObject({
      name: 'netto',
      labelKey: 'inputs.netto',
      suffix: '€',
    });
    expect(mehrwertsteuerMode.calculate).toBe(calculateMehrwertsteuer);
  });
});
