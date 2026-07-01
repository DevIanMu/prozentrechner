import localFont from 'next/font/local';
import './[locale]/globals.css';

const inter = localFont({
  src: './fonts/Inter-latin.woff2',
  variable: '--font-inter',
  display: 'swap',
});
const jetbrainsMono = localFont({
  src: './fonts/JetBrainsMono-latin.woff2',
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const KATEX_CSS = 'https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.css';
const KATEX_CSS_INTEGRITY = 'sha384-vlBdW0r3AcZO/HboRPznQNowvexd3fY8qHOWkBi5q7KGgqJ+F48+DceybYmrVbmB';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const rulesetId = process.env.NEXT_PUBLIC_USERCENTRICS_RULESET_ID?.trim();
  const showAutoblocker = !!rulesetId && rulesetId !== 'YOUR_USERCENTRICS_RULESET_ID';

  return (
    <html lang="de" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://app.usercentrics.eu" />
        <link rel="preconnect" href="https://app.usercentrics.eu" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="preload"
          href={KATEX_CSS}
          as="style"
          integrity={KATEX_CSS_INTEGRITY}
          crossOrigin="anonymous"
        />
        <link
          id="katex-style"
          rel="stylesheet"
          href={KATEX_CSS}
          media="print"
          integrity={KATEX_CSS_INTEGRITY}
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.getElementById('katex-style');if(l){l.onload=function(){this.media='all';};if(l.sheet){l.media='all';}}})();`,
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href={KATEX_CSS}
            integrity={KATEX_CSS_INTEGRITY}
            crossOrigin="anonymous"
          />
        </noscript>
        {showAutoblocker && (
          /* eslint-disable-next-line @next/next/no-sync-scripts */
          <script src="https://web.cmp.usercentrics.eu/modules/autoblocker.js" />
        )}
      </head>
      <body className="font-sans antialiased bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}
