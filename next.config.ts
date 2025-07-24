import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Disable webpack cache in production to avoid large cache files
    if (process.env.NODE_ENV === "production") {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
