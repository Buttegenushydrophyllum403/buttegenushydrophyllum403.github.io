import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/cv", destination: "/cv/rifat-sarwar-cv.pdf", permanent: false },
      { source: "/resume", destination: "/cv/rifat-sarwar-cv.pdf", permanent: false },
    ];
  },
};

export default nextConfig;
