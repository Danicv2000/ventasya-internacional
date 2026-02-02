/** @type {import('next').NextConfig} */
const nextConfig = {


  basePath: process.env.ENVIROMENT == "prod" ? '/ventasya-internacional/' : '',
  assetPrefix: process.env.ENVIROMENT == "prod" ? '/ventasya-internacional/' : '',
  //trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use webpack instead of turbopack
  turbopack: {},
  webpack: (config) => {
    return config;
  },
}

export default nextConfig
