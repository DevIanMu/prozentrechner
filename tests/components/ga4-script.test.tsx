import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { GA4Script } from '@/components/analytics/ga4-script';

describe('GA4Script', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns null when env var is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_GA4_ID', '');
    const { container } = render(<GA4Script />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when env var is the placeholder YOUR_GA4_ID', () => {
    vi.stubEnv('NEXT_PUBLIC_GA4_ID', 'YOUR_GA4_ID');
    const { container } = render(<GA4Script />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null for an invalid ID', () => {
    vi.stubEnv('NEXT_PUBLIC_GA4_ID', 'not-valid');
    const { container } = render(<GA4Script />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the inline init script and external script when given a valid ID', () => {
    vi.stubEnv('NEXT_PUBLIC_GA4_ID', 'G-ABC123');
    const { container } = render(<GA4Script />);

    const inlineScript = container.querySelector('script#gtag-init');
    expect(inlineScript).toBeInTheDocument();

    const externalScript = container.querySelector('script#gtag-script');
    expect(externalScript).toBeInTheDocument();
    expect(externalScript).toHaveAttribute(
      'src',
      'https://www.googletagmanager.com/gtag/js?id=G-ABC123'
    );
    expect(externalScript).toHaveAttribute('async');
  });

  it('contains the default denied consent states', () => {
    vi.stubEnv('NEXT_PUBLIC_GA4_ID', 'G-ABC123');
    const { container } = render(<GA4Script />);

    const inlineScript = container.querySelector('script#gtag-init');
    const content = inlineScript?.textContent ?? '';

    expect(content).toContain("window.gtag('consent', 'default'");
    expect(content).toContain("analytics_storage: 'denied'");
    expect(content).toContain("ad_storage: 'denied'");
    expect(content).toContain("ad_user_data: 'denied'");
    expect(content).toContain("ad_personalization: 'denied'");
  });

  it('contains the ucEvent listener and gtag consent update logic', () => {
    vi.stubEnv('NEXT_PUBLIC_GA4_ID', 'G-ABC123');
    const { container } = render(<GA4Script />);

    const inlineScript = container.querySelector('script#gtag-init');
    const content = inlineScript?.textContent ?? '';

    expect(content).toContain("window.addEventListener('ucEvent'");
    expect(content).toContain("event.detail.event !== 'consent_status'");
    expect(content).toContain("event.detail.type !== 'explicit'");
    expect(content).toContain("'Google Analytics 4': 'analytics_storage'");
    expect(content).toContain("'Google Ads': 'ad_storage'");
    expect(content).toContain("'Display & Video 360': 'ad_storage'");
    expect(content).toContain('gtag(\'consent\', \'update\', consentUpdate)');
    expect(content).toContain('ad_user_data = consentUpdate.ad_storage');
    expect(content).toContain('ad_personalization = consentUpdate.ad_storage');
  });
});
