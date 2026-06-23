import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
