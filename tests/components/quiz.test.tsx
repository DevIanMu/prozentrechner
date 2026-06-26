import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { Quiz } from '@/components/quiz';
import messages from '@/messages/de.json';
import type { Quiz as QuizType } from '@/lib/content';

function renderWithIntl(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider messages={messages} locale="de">
      {ui}
    </NextIntlClientProvider>
  );
}

const items: QuizType[] = [
  {
    question: 'Was ist 20 % von 100?',
    options: ['10', '20', '30'],
    correctIndex: 1,
    explanation: '20 % von 100 ergibt 20.',
  },
];

describe('Quiz', () => {
  it('returns null when items is empty', () => {
    const { container } = renderWithIntl(<Quiz items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders quiz question and options', () => {
    renderWithIntl(<Quiz items={items} />);

    expect(screen.getByText('Was ist 20 % von 100?')).toBeInTheDocument();
    expect(screen.getByLabelText('10')).toBeInTheDocument();
    expect(screen.getByLabelText('20')).toBeInTheDocument();
    expect(screen.getByLabelText('30')).toBeInTheDocument();
  });

  it('shows success indicator and explanation when the correct option is selected', async () => {
    renderWithIntl(<Quiz items={items} />);

    await userEvent.click(screen.getByLabelText('20'));

    expect(screen.getByText('Richtig!')).toBeInTheDocument();
    expect(screen.getByText('Erklärung')).toBeInTheDocument();
    expect(screen.getByText('20 % von 100 ergibt 20.')).toBeInTheDocument();
    expect(screen.getByTestId('quiz-live-region')).toHaveTextContent('Richtig!');
  });

  it('shows failure indicator and explanation when a wrong option is selected', async () => {
    renderWithIntl(<Quiz items={items} />);

    await userEvent.click(screen.getByLabelText('10'));

    expect(screen.getByText('Leider falsch.')).toBeInTheDocument();
    expect(screen.getByText('Erklärung')).toBeInTheDocument();
    expect(screen.getByText('20 % von 100 ergibt 20.')).toBeInTheDocument();
    expect(screen.getByTestId('quiz-live-region')).toHaveTextContent('Leider falsch.');
  });

  it('keeps the correct option interactive after selecting a wrong option', async () => {
    renderWithIntl(<Quiz items={items} />);

    await userEvent.click(screen.getByLabelText('10'));

    expect(screen.getByLabelText('10')).toBeDisabled();
    expect(screen.getByLabelText('30')).toBeDisabled();
    expect(screen.getByLabelText('20')).not.toBeDisabled();

    await userEvent.click(screen.getByLabelText('20'));

    expect(screen.getByText('Richtig!')).toBeInTheDocument();
    expect(screen.getByTestId('quiz-live-region')).toHaveTextContent('Richtig!');
  });
});
