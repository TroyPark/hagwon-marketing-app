/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  output: 'export',
  basePath: isProd ? '/hagwon-marketing-app' : '',
  assetPrefix: isProd ? '/hagwon-marketing-app' : '',
  images: { unoptimized: true },
};
module.exports = nextConfig;
