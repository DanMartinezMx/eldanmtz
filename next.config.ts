import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/uses",
        destination: "/about",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // The TinaCMS admin is a static SPA at public/admin/index.html. Next does
      // not auto-resolve the directory path /admin to its index.html, so serve
      // it explicitly. (/admin/ → 308 → /admin → this rewrite.)
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];

    // Permissive CSP required by the TinaCMS admin SPA: it evaluates code at
    // runtime ('unsafe-eval') and loads assets from unpkg/Tina/S3.
    const adminCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://content.tinajs.io https://identity.tinajs.io https://assets.tina.io https://media.tinajs.io https://*.tinajs.io https://*.tina.io https://s3.us-east-1.amazonaws.com https://*.amazonaws.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    // Stricter CSP for the public site: no 'unsafe-eval' and no unpkg. Inline
    // scripts (JSON-LD, theme bootstrap) still need 'unsafe-inline'.
    const siteCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          // In dev, Tina's local editing runs against the whole site, so use the
          // permissive policy everywhere. In production, lock the public site down.
          { key: "Content-Security-Policy", value: isDev ? adminCsp : siteCsp },
        ],
      },
      {
        // Matches after the rule above; for /admin the same header key wins here,
        // overriding the site CSP with the permissive one Tina requires.
        source: "/admin/:path*",
        headers: [{ key: "Content-Security-Policy", value: adminCsp }],
      },
    ];
  },
};

export default nextConfig;