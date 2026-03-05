import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "prisma",
    "mongodb",
    "@prisma/client",
  ],
  transpilePackages: [".prisma"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '62823221dfff75d61e6a8dfc45ad4148.r2.cloudflarestorage.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
