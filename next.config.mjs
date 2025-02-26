export default {
  webpack(config, { isServer }) {
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