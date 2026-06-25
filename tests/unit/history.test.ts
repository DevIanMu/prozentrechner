import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  HISTORY_KEY_PREFIX,
  HISTORY_LIMIT,
  getHistory,
  addHistoryEntry,
  clearHistory,
  type HistoryEntry,
} from '@/lib/history';

const storage: Record<string, string> = {};

beforeEach(() => {
  for (const key of Object.keys(storage)) {
    delete storage[key];
  }

  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => storage[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key];
    }),
  });

  vi.stubGlobal('crypto', {
    randomUUID: vi.fn(() => 'test-uuid'),
  });
});

describe('history constants', () => {
  it('exports the expected key prefix', () => {
    expect(HISTORY_KEY_PREFIX).toBe('prozentrechner_history_');
  });

  it('exports the expected history limit', () => {
    expect(HISTORY_LIMIT).toBe(20);
  });
});

describe('getHistory', () => {
  it('returns an empty array when localStorage is empty', () => {
    expect(getHistory('prozentwert')).toEqual([]);
  });

  it('returns an empty array when localStorage contains invalid JSON', () => {
    storage[`${HISTORY_KEY_PREFIX}prozentwert`] = 'not-json';
    expect(getHistory('prozentwert')).toEqual([]);
  });

  it('returns parsed entries when localStorage contains valid JSON', () => {
    const entries: HistoryEntry[] = [
      {
        id: 'entry-1',
        timestamp: 1_000,
        inputs: { wert: 100, prozent: 20 },
        result: 20,
        mode: 'prozentwert',
      },
    ];
    storage[`${HISTORY_KEY_PREFIX}prozentwert`] = JSON.stringify(entries);

    expect(getHistory('prozentwert')).toEqual(entries);
  });
});

describe('addHistoryEntry', () => {
  it('stores an entry and getHistory returns it', () => {
    addHistoryEntry('prozentwert', { wert: 100, prozent: 20 }, 20);

    const history = getHistory('prozentwert');
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      id: 'test-uuid',
      inputs: { wert: 100, prozent: 20 },
      result: 20,
      mode: 'prozentwert',
    });
    expect(history[0].timestamp).toBeGreaterThan(0);
  });

  it('prepends newer entries to the front', () => {
    vi.stubGlobal('crypto', {
      randomUUID: vi
        .fn()
        .mockReturnValueOnce('first-id')
        .mockReturnValueOnce('second-id'),
    });

    addHistoryEntry('prozentwert', { wert: 100, prozent: 20 }, 20);
    addHistoryEntry('prozentwert', { wert: 200, prozent: 10 }, 20);

    const history = getHistory('prozentwert');
    expect(history).toHaveLength(2);
    expect(history[0].id).toBe('second-id');
    expect(history[1].id).toBe('first-id');
  });

  it('trims history to HISTORY_LIMIT keeping the most recent entries', () => {
    for (let i = 0; i < HISTORY_LIMIT + 1; i++) {
      vi.stubGlobal('crypto', {
        randomUUID: vi.fn(() => `id-${i}`),
      });
      addHistoryEntry('prozentwert', { wert: i, prozent: 10 }, i * 0.1);
    }

    const history = getHistory('prozentwert');
    expect(history).toHaveLength(HISTORY_LIMIT);
    expect(history[0].id).toBe(`id-${HISTORY_LIMIT}`);
    expect(history[HISTORY_LIMIT - 1].id).toBe('id-1');
  });

  it('uses a timestamp + random fallback when crypto.randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', undefined);

    addHistoryEntry('prozentwert', { wert: 100, prozent: 20 }, 20);

    const history = getHistory('prozentwert');
    expect(history).toHaveLength(1);
    expect(history[0].id).toMatch(/^\d+-\d+(\.\d+)?$/);
  });
});

describe('clearHistory', () => {
  it('removes all entries for a mode', () => {
    addHistoryEntry('prozentwert', { wert: 100, prozent: 20 }, 20);
    expect(getHistory('prozentwert')).toHaveLength(1);

    clearHistory('prozentwert');
    expect(getHistory('prozentwert')).toEqual([]);
  });
});

describe('mode isolation', () => {
  it('keeps separate histories for different modes', () => {
    addHistoryEntry('prozentwert', { wert: 100, prozent: 20 }, 20);
    addHistoryEntry('prozentsatz', { teil: 20, ganze: 100 }, 20);

    expect(getHistory('prozentwert')).toHaveLength(1);
    expect(getHistory('prozentsatz')).toHaveLength(1);
    expect(getHistory('prozentwert')[0].mode).toBe('prozentwert');
    expect(getHistory('prozentsatz')[0].mode).toBe('prozentsatz');
  });
});
