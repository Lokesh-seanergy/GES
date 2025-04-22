import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  basePath: "/ges-workbench",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
