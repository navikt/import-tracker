/* eslint-disable no-undef */
module.exports = {
  presets: [require("@navikt/ds-tailwind")],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./stories/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        0: 0,
      },
      maxHeight: {
        "screen-header": "calc(100vh - 48px)",
      },
      minHeight: {
        "screen-header": "calc(100vh - 48px)",
      },
      boxShadow: {
        "focus-inset": "inset var(--navds-shadow-focus)",
        "focus-inset-inverted": "inset var(--navds-shadow-focus-inverted)",
      },
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
    },
    animation: {
      fadeIn: "fadeIn 0.15s cubic-bezier(0.65, 0, 0.35, 1)",
    },
  },
};
