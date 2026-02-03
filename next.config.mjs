/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.ENVIROMENT === "prod" ? '/ventasya-internacional/' : '',
  assetPrefix: process.env.ENVIROMENT === "prod" ? '/ventasya-internacional/' : '/ventasya-internacional/',
  //trailingSlash: process.env.ENVIROMENT === "prod" ? true : false,
  typescript: {
    ignoreBuildErrors: false,
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
