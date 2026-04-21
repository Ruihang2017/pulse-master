import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@pulse/shared", "@pulse/db", "@pulse/ai"],
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG ?? "pulse",
  project: "pulse-web",
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
