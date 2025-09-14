/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: false,
  images: {
    domains: ['cdn.cosmicjs.com', 'imgix.cosmicjs.com'],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: false
  }
}

module.exports = nextConfig