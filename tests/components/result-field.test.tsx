import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { ResultField } from '@/components/calculator/result-field';
import messages from '@/messages/de.json';

function renderWithIntl(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider messages={messages} locale="de">
      {ui}
    </NextIntlClientProvider>
  );
}

describe('ResultField', () => {
  it('renders label and value', () => {
    renderWithIntl(
      <ResultField label="Prozentwert" value="100,00 €" />
    );

    expect(screen.getByText('Prozentwert')).toBeInTheDocument();
    expect(screen.getByText('100,00 €')).toBeInTheDocument();
  });

  it('copies copyText to clipboard when copy button is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    renderWithIntl(
      <ResultField
        label="Prozentwert"
        value="100,00 €"
        copyText="20% von 500 = 100,00 €"
      />
    );

    const button = screen.getByRole('button', { name: /Kopieren/i });
    await userEvent.click(button);

    expect(writeText).toHaveBeenCalledWith('20% von 500 = 100,00 €');
  });

  it('falls back to copying the displayed value when copyText is omitted', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    renderWithIntl(<ResultField label="Prozentwert" value="100,00 €" />);

    const button = screen.getByRole('button', { name: /Kopieren/i });
    await userEvent.click(button);

    expect(writeText).toHaveBeenCalledWith('100,00 €');
  });
});
