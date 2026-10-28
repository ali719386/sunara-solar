import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 75 is the default; 90 is used for detailed photography (services page).
    qualities: [75, 90],
  },
};

export default nextConfig;
