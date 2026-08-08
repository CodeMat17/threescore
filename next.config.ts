import type { NextConfig } from "next";

const convexHost = process.env.NEXT_PUBLIC_CONVEX_URL
  ? new URL(process.env.NEXT_PUBLIC_CONVEX_URL).hostname
  : "perfect-kookabura-160.convex.cloud";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: typically 30-50% smaller than WebP at equal quality, which is
    // the difference between passing and failing LCP on a photo-led hero.
    formats: ["image/avif", "image/webp"],
    // Trimmed from the defaults to the widths this layout actually requests,
    // so the optimizer cache isn't fragmented across sizes nobody fetches.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Convex storage URLs are content-addressed and immutable.
    minimumCacheTTL: 60 * 60 * 24 * 365,
    remotePatterns: [
      { protocol: "https", hostname: convexHost },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Ship less JS: strip `console.*` (except errors) from production builds.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // Tree-shake barrel imports from icon/UI packages rather than pulling the
  // whole module graph into every route that uses one icon.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
