import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.worldvectorlogo.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "logos-world.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "companieslogo.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "parsefiles.back4app.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jim-nielsen.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
