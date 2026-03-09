import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/itsfizz-assignment" : "",
  assetPrefix: isProd ? "/itsfizz-assignment/" : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/itsfizz-assignment" : "",
  },
};

export default nextConfig;
