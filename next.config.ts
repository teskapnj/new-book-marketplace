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
    // OPTİMİZASYON KAPALI: ürün görselleri Amazon'dan geliyor, zaten küçük ve
    // optimize. Vercel'in her ekran boyutu için ayrı sürüm üretmesi ücretsiz
    // kotayı (5.000 dönüşüm/ay) boşuna yakıyordu.
    unoptimized: true,
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
            // camera=() tum kaynaklara kamerayi kapatiyordu, barkod tarayici
            // Chrome'da calismayabilir. self eklendi.
            value: "camera=(self), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval'
                https://apis.google.com
                https://www.gstatic.com
                https://www.googletagmanager.com
                https://va.vercel-scripts.com
                https://googleads.g.doubleclick.net
                https://www.googleadservices.com
                https://www.google-analytics.com
                https://connect.facebook.net;
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
              frame-src https://*.firebaseapp.com https://*.google.com
                https://googleads.g.doubleclick.net
                https://td.doubleclick.net;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/sell-books-and-dvds-for-cash',
        destination: '/sell-books-for-cash',
        permanent: true,
      },
      {
        source: '/browse',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  async rewrites() {
    return [
      {
        source: '/sell',
        destination: '/',
      }
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