'use client';

import { useEffect, useRef } from 'react';

const KATEX_CSS_URL = 'https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.css';

export function KaTeXPreload() {
  const linkRef = useRef<HTMLLinkElement>(null);

  useEffect(() => {
    if (linkRef.current) {
      linkRef.current.rel = 'stylesheet';
    }
  }, []);

  return (
    <>
      <link ref={linkRef} rel="preload" href={KATEX_CSS_URL} as="style" />
      <noscript>
        <link rel="stylesheet" href={KATEX_CSS_URL} />
      </noscript>
    </>
  );
}
