/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/webp", "image/avif"],
    domains: ["avatars.githubusercontent.com"],
  },

  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  swcMinify: true,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "date-fns",
      "recharts",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-select",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-menubar",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-scroll-area",
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Changed from SAMEORIGIN to allow the frame to function correctly
            // with external scripts, though CSP frame-ancestors is more modern.
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000 https://www.googletagmanager.com https://cloudflareinsights.com https://assets.calendly.com https://calendly.com; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com; " +
              "font-src 'self' https://fonts.gstatic.com; " +
              "img-src 'self' data: https://avatars.githubusercontent.com https://*.githubusercontent.com https://assets.calendly.com; " +
              "connect-src 'self' http://localhost:3000 https://www.google-analytics.com https://stats.g.doubleclick.net https://app.cal.com; " +
              "frame-src 'self' https://calendly.com https://app.cal.com;",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source:
          "/(.*)\\.(js|css|woff|woff2|ttf|otf|ico|png|jpg|jpeg|gif|svg|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, mutable",
          },
        ],
      },
      {
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
