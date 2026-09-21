import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
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
                https://bat.bing.net;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:
                https://firebasestorage.googleapis.com
                https://www.gstatic.com
                https://www.google.com;
              font-src 'self' data:;
              connect-src 'self' https: wss:
                https://*.firebaseio.com
                https://*.googleapis.com
                https://*.gstatic.com
                https://bat.bing.com
                https://bat.bing.net;
              frame-src
                https://*.firebaseapp.com
                https://*.google.com
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
        source: "/sell-books-and-dvds-for-cash",
        destination: "/sell-books-for-cash",
        permanent: true,
      },

      {
        source: "/browse",
        destination: "/",
        permanent: true,
      },

      {
        source: "/sell",
        destination: "/",
        permanent: true,
      },

      {
        source: "/guides/sell-video-games-for-cash",
        destination: "/guides/what-makes-used-video-games-valuable",
        permanent: true,
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