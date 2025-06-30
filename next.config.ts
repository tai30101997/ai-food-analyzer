const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(','),
    },
  },
};

export default nextConfig;