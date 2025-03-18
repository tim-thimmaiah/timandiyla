import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["geist"],
  images: {
    domains: ["127.0.0.1", "timandiyla.vercel.app"],
  },
};

export default nextConfig;
