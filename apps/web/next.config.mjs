/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@pulse/shared", "@pulse/db", "@pulse/ai"],
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
