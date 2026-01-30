/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable turbopack to use webpack for font handling
  serverExternalPackages: ['llm-scraper'],
  webpack: (config) => {
    // Handle .ttf files from playwright-core
    config.module.rules.push({
      test: /\.(ttf|woff|woff2|eot)$/,
      type: 'asset/resource',
      issuer: /\.(js|ts|jsx|tsx)$/,
    });
    
    return config;
  },
}

export default nextConfig
