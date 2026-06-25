import { describe, it, expect } from 'vitest';
import {
  modes,
  modesById,
  getModeById,
} from '@/lib/calculations';
import { prozentwertMode } from '@/lib/calculations/prozentwert';

const expectedIds = [
  'prozentwert',
  'prozentsatz',
  'grundwert',
  'prozentuale-veraenderung',
  'rabatt-berechnen',
  'mehrwertsteuer',
  'abzunahme',
];

describe('calculation mode registry', () => {
  it('has all 7 modes', () => {
    expect(modes).toHaveLength(7);
  });

  it('contains all expected ids in order', () => {
    expect(modes.map((mode) => mode.id)).toEqual(expectedIds);
  });

  it('returns the prozentwert mode by id', () => {
    expect(getModeById('prozentwert')).toBe(prozentwertMode);
  });

  it('returns undefined for unknown ids', () => {
    expect(getModeById('unknown')).toBeUndefined();
  });

  it('maps every id to its mode', () => {
    for (const mode of modes) {
      expect(modesById[mode.id]).toBe(mode);
    }
  });
});
