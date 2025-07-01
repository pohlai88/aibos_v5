/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better debugging
  reactStrictMode: true,

  // Enable source maps in development
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.devtool = isServer ? "source-map" : "eval-source-map";
    }

    return config;
  },

  // Enable experimental features for better debugging
  experimental: {
    // Enable React DevTools in production (for debugging)
    optimizePackageImports: ["@supabase/supabase-js"],
  },

  // Custom headers for debugging
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Debug-Mode",
            value: process.env.NODE_ENV === "development" ? "true" : "false",
          },
        ],
      },
    ];
  },

  // Enable detailed logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
