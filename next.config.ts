import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // basePath is /ARMYBookmark on GitHub Pages; empty for local dev
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  images: { unoptimized: true }, // required for static export
};

export default nextConfig;
