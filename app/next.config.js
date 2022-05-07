/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    gh_token: process.env.TOKEN,
    isLocal: process.env.LOCAL,
  },
};

module.exports = nextConfig;
