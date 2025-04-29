/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/ges-workbench',
  basePath: '/GES',
  output: 'standalone',
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