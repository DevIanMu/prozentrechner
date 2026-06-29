export type GAEventParams = Record<string, string | number | boolean>;

type GtagFunction = (
  command: 'event',
  eventName: string,
  params?: GAEventParams
) => void;

export function sendGAEvent(eventName: string, params?: GAEventParams): void {
  if (typeof window === 'undefined') {
    return;
  }

  const gtag = (window as Window & { gtag?: GtagFunction }).gtag;
  if (typeof gtag !== 'function') {
    return;
  }

  gtag('event', eventName, params);
}

export function sendCopyResultEvent(mode: string): void {
  sendGAEvent('copy_result', { mode });
}

export function sendQuizAnswerEvent(
  mode: string,
  questionIndex: number,
  isCorrect: boolean
): void {
  sendGAEvent('quiz_answer', {
    mode,
    question_index: questionIndex,
    is_correct: isCorrect,
  });
}

export function sendCalculateEvent(mode: string): void {
  sendGAEvent('calculate', { mode });
}
