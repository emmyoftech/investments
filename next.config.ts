// ⚠️ Note: Next.js does NOT export a `NextConfig` type — keep this untyped for compatibility.

const nextConfig = {
  // ✅ Correct key for Next.js 15.5.4+
  serverExternalPackages: ["@prisma/client", "bcrypt"],

  typescript: {
    ignoreBuildErrors: false,
  },

  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      };
    }
    return config;
  },

  // turbopack workspace root
  turbopack: {
    // root: "C:\\Users\\VICTOR\\Downloads\\workspace",
    root:"C:\\Users\\EMMANUEL\\Documents\\Projects\\external\\investments",
  },
};

export default nextConfig;