import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [new URL("https://bluemoji.io/**")],
  },
  allowedDevOrigins: ["http://192.168.1.103:3000", "ws://192.168.1.103:3000"],
};

export default nextConfig;
