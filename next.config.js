/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const isStaticExport = process.env.NEXT_BUILD === '1';

const nextConfig = {
  output: isStaticExport ? 'export' : undefined,
  distDir: 'dist',
  images: { unoptimized: true },
  trailingSlash: isStaticExport,
};

module.exports = withNextIntl(nextConfig);
