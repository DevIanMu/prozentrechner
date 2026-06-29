import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { ResultField } from '@/components/calculator/result-field';
import messages from '@/messages/de.json';
import * as analytics from '@/lib/analytics';

function renderWithIntl(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider messages={messages} locale="de">
      {ui}
    </NextIntlClientProvider>
  );
}

describe('ResultField', () => {
  beforeEach(() => {
    vi.spyOn(analytics, 'sendCopyResultEvent').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders label and value', () => {
    renderWithIntl(
      <ResultField label="Prozentwert" value="100,00 €" />
    );

    expect(screen.getByText('Prozentwert')).toBeInTheDocument();
    expect(screen.getByText('100,00 €')).toBeInTheDocument();
  });

  it('announces result changes via a polite live region', () => {
    const { rerender } = renderWithIntl(
      <ResultField label="Prozentwert" value="-" />
    );

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-atomic', 'true');
    expect(status).toHaveTextContent('-');

    rerender(
      <NextIntlClientProvider messages={messages} locale="de">
        <ResultField label="Prozentwert" value="100,00 €" />
      </NextIntlClientProvider>
    );

    expect(status).toHaveTextContent('100,00 €');
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
        mode="prozentwert"
      />
    );

    const button = screen.getByRole('button', { name: /Kopieren/i });
    await userEvent.click(button);

    expect(writeText).toHaveBeenCalledWith('20% von 500 = 100,00 €');
    expect(analytics.sendCopyResultEvent).toHaveBeenCalledWith('prozentwert');
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
    expect(analytics.sendCopyResultEvent).not.toHaveBeenCalled();
  });

  it('does not send an analytics event when mode is omitted', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    renderWithIntl(<ResultField label="Prozentwert" value="100,00 €" />);

    const button = screen.getByRole('button', { name: /Kopieren/i });
    await userEvent.click(button);

    expect(analytics.sendCopyResultEvent).not.toHaveBeenCalled();
  });
});
