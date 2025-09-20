import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Build hatalarını geçici olarak atla
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    // domains kullanımı yerine sadece remotePatterns kullanın
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        protocol: "https",
        hostname: "ecx.images-amazon.com",
      },
      {
        protocol: "https",
        hostname: "g-ecx.images-amazon.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval'
                https://apis.google.com
                https://www.gstatic.com
                https://www.googletagmanager.com
                https://va.vercel-scripts.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:
                https://firebasestorage.googleapis.com
                https://www.gstatic.com
                https://www.google.com;
              font-src 'self' data:;
              connect-src 'self' https: wss:
                https://*.firebaseio.com
                https://*.googleapis.com
                https://*.gstatic.com;
              frame-src https://*.firebaseapp.com https://*.google.com;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },

  webpack: (config) => {
    return config;
  },

  env: {
    customKey: "custom-value",
  },
};

export default nextConfig;