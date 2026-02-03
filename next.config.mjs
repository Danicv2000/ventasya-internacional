/** @type {import('next').NextConfig} */

const nextConfig = {
  //output: 'export',
  //distDir: 'out',
  basePath: process.env.ENVIROMENTS === 'test' ? '/ventasya-internacional' : '',
  assetPrefix: process.env.ENVIROMENTS === 'test' ? '/ventasya-internacional/' : '',
  trailingSlash: process.env.ENVIROMENTS === 'test' ? true : false,

  typescript: {
    ignoreBuildErrors: false,
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
