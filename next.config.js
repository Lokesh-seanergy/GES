/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/ges-workbench',
  basePath: '/GES',
  assetPrefix: '/GES',
  output: 'standalone',
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
}
 
module.exports = nextConfig 