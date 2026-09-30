import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.3.3.15"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;