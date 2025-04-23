/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/ges-workbench',
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