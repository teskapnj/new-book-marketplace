import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'm.media-amazon.com',
      'images-na.ssl-images-amazon.com',
      'ecx.images-amazon.com',
      'g-ecx.images-amazon.com'
    ],
    // İsteğe bağlı: Resim optimizasyon ayarları
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // İsteğe bağlı: Uzak resimler için desen (daha fazla kontrol sağlar)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazon.com',
      },
    ],
  },
  // Güvenlik başlıkları
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://m.media-amazon.com https://images-na.ssl-images-amazon.com https://ecx.images-amazon.com https://g-ecx.images-amazon.com https://firebasestorage.googleapis.com; font-src 'self' data:; connect-src 'self' https:;",
          },
        ],
      },
    ];
  },
  // Webpack yapılandırmaları
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Özel webpack yapılandırmaları buraya eklenebilir
    return config;
  },
  // Çevre değişkenleri
  env: {
    customKey: 'custom-value',
  },
};

export default nextConfig;