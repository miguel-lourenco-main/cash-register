import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Emit each route as `<route>/index.html` so static hosts without rewrites
  // (GitLab Pages) can serve deep links like `/orders` on reload or when shared.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
