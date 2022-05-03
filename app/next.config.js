/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
  },
  serverRuntimeConfig: {
    gh_token: process.env.TOKEN,
  },
};

module.exports = nextConfig;
