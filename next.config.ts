import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'salt.tikicdn.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  experimental: {
    authInterrupts: true
  }
}

export default nextConfig
