import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  sendGAEvent,
  sendCopyResultEvent,
  sendQuizAnswerEvent,
  sendCalculateEvent,
} from '@/lib/analytics';

describe('analytics', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { gtag: undefined });
  });

  describe('sendGAEvent', () => {
    it('does nothing when window is undefined', () => {
      vi.stubGlobal('window', undefined);
      expect(() => sendGAEvent('test_event')).not.toThrow();
    });

    it('does nothing when window.gtag is absent', () => {
      sendGAEvent('test_event', { foo: 'bar' });
      expect(true).toBe(true);
    });

    it('does nothing when window.gtag is not a function', () => {
      vi.stubGlobal('window', { gtag: 'not-a-function' });
      expect(() => sendGAEvent('test_event')).not.toThrow();
    });

    it('calls gtag("event", ...) with the right arguments when available', () => {
      const gtag = vi.fn();
      vi.stubGlobal('window', { gtag });

      sendGAEvent('copy_result', { mode: 'prozentwert' });

      expect(gtag).toHaveBeenCalledTimes(1);
      expect(gtag).toHaveBeenCalledWith('event', 'copy_result', {
        mode: 'prozentwert',
      });
    });
  });

  describe('sendCopyResultEvent', () => {
    it('sends a copy_result event with the provided mode', () => {
      const gtag = vi.fn();
      vi.stubGlobal('window', { gtag });

      sendCopyResultEvent('prozentwert');

      expect(gtag).toHaveBeenCalledTimes(1);
      expect(gtag).toHaveBeenCalledWith('event', 'copy_result', {
        mode: 'prozentwert',
      });
    });
  });

  describe('sendQuizAnswerEvent', () => {
    it('sends a quiz_answer event with mode, question index, and correctness', () => {
      const gtag = vi.fn();
      vi.stubGlobal('window', { gtag });

      sendQuizAnswerEvent('prozentsatz', 2, true);

      expect(gtag).toHaveBeenCalledTimes(1);
      expect(gtag).toHaveBeenCalledWith('event', 'quiz_answer', {
        mode: 'prozentsatz',
        question_index: 2,
        is_correct: true,
      });
    });
  });

  describe('sendCalculateEvent', () => {
    it('sends a calculate event with the provided mode', () => {
      const gtag = vi.fn();
      vi.stubGlobal('window', { gtag });

      sendCalculateEvent('grundwert');

      expect(gtag).toHaveBeenCalledTimes(1);
      expect(gtag).toHaveBeenCalledWith('event', 'calculate', {
        mode: 'grundwert',
      });
    });
  });
});
