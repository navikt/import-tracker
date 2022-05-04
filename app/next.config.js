/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: "nodejs",
    serverComponents: true,
  },
  serverRuntimeConfig: {
    gh_token: process.env.TOKEN,
  },
};

module.exports = nextConfig;
