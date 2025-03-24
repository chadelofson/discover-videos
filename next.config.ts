import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { 
        hostname: "images.unsplash.com"
      },
      {
        hostname: "i.ytimg.com",
      }
    ]
  }
};

export default nextConfig;
