import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Design-Sandbox",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
