import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignoriert ESLint-Fehler beim Vercel-Build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;