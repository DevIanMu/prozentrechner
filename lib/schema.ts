import type { FAQ, CalculatorContent } from '@/lib/content';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildSoftwareApplicationSchema(content: CalculatorContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: content.h1,
    description: content.metaDescription,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    inLanguage: 'de',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  };
}

export function buildFAQPageSchema(faq: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildWebSiteSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ProzentRechner',
    url: baseUrl,
    inLanguage: 'de',
  };
}

export function buildOrganizationSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ProzentRechner',
    url: baseUrl,
  };
}
