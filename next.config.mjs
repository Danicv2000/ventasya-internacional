/** @type {import('next').NextConfig} */
const nextConfig = {
  //basePath: '/ventasya-internacional',
  //assetPrefix: '/ventasya-internacional/',
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
