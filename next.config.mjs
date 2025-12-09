/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: "/portfolio",
  async redirects() {
    return [
      {
        source: '/',
        destination: '/portfolio',
        basePath: false,
        permanent: true,
      },
    ]
  },
}

export default nextConfig
