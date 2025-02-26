/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    // Fallback for certain Node.js core modules when building for the client
    if (!isServer) {
      config.resolve.fallback = {
        tls: false,
        net: false,
        util: false,
        fs: false, // Optional: You can also exclude 'fs' if used in any part of the code
      };
    }
    return config;
  },
};
