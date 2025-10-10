/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/videos/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination:
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/graphql',
      },
    ];
  },
};

module.exports = nextConfig;
