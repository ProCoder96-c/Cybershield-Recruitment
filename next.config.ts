import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Team photos come from Vercel Blob (or any https URL the admin pastes)
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
