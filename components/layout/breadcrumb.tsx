import * as React from 'react';

import { Link } from '@/lib/navigation';
import { buildBreadcrumbListSchema, type BreadcrumbItem } from '@/lib/schema';
import { JsonLd } from '@/components/schema/json-ld';

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  const schema = buildBreadcrumbListSchema(items);

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.url} className="flex items-center gap-2">
                {isLast ? (
                  <span
                    aria-current="page"
                    className="text-body-sm text-ink"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-body-sm text-muted hover:text-ink transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
                {!isLast && (
                  <span aria-hidden="true" className="text-body-sm text-surface-strong">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
