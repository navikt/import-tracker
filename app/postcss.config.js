// eslint-disable-next-line no-undef
module.exports = {
  plugins: {
    tailwindcss: {},
    // eslint-disable-next-line no-undef
    ...(process.env.NODE_ENV === "production"
      ? { cssnano: { preset: "default" } }
      : {}),
  },
};
