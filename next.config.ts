import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // We need to support the existing src/ directory structure
  // but Next.js App Router expects app/ directory at the root or src/app/
  // The user wants app/ directory.
};

export default nextConfig;
