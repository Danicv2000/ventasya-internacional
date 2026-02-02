/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: process.env.GITHUB_PAGES ? '/ventasya-internacional' : '',
  assetPrefix: process.env.GITHUB_PAGES ? '/ventasya-internacional/' : '',
  trailingSlash: process.env.GITHUB_PAGES ? true : false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use webpack instead of turbopack
  turbopack: {},
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.output.publicPath = 'auto';
    }
    return config;
  },
}

export default nextConfig
