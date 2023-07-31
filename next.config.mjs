/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgix.cosmicjs.com",
      },
      {
        protocol: "https",
        hostname: "cdn.cosmicjs.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
}

export default nextConfig
