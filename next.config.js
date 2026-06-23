/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = withNextIntl(nextConfig);
