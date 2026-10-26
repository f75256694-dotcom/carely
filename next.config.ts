import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      { source: "/funnel", destination: "/care-seeker/apply", permanent: true },
      { source: "/imprint", destination: "/impressum", permanent: true },
      { source: "/terms", destination: "/agb", permanent: true },
      // No /AGB -> /agb redirect: Next.js matches redirect sources
      // case-insensitively, so it would redirect /agb to itself.
    ];
  },
};

export default nextConfig;
