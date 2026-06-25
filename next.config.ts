import type { NextConfig } from "next";

const contentSecurityPolicyReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://generativelanguage.googleapis.com https://vitals.vercel-insights.com https://*.vercel-insights.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' data:",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // V12.12.2: report-only first so launch hardening does not accidentally block
  // Stripe checkout, Vercel assets, fonts or route-planner UI. Tighten to enforced
  // CSP after reviewing production reports.
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicyReportOnly },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // V10.9: alias in case anything links to "/services-directory" instead of "/services".
      {
        source: "/services-directory",
        destination: "/services",
        permanent: true,
      },
      // V10.9: belt-and-suspenders www -> apex redirect at the app level.
      // Primary canonical enforcement should still happen at the Vercel/DNS domain level.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.settlemap.app" }],
        destination: "https://settlemap.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
