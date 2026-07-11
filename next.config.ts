import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.indramusicschool.cloud",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
