import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://images.pexels.com/photos/**"),
      new URL("https://placehold.co/200/**"),
      new URL(
        "https://kwwrtjltivcynzlmnawz.supabase.co/storage/v1/object/public/product-images/**"
      ),
      new URL("https://example.com/images/**"),
    ],
  },
};

export default nextConfig;
