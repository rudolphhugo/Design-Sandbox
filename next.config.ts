import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages && {
    output: "export",
    basePath: "/Design-Sandbox",
  }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
