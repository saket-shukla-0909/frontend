module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/daisyui/dist/**/*.js", // ✅ include DaisyUI components
  ],
  safelist: [
    {
      pattern: /chat(-start|-end|-bubble|-bubble-info)?/, // ✅ safer match
    },
    {
      pattern: /(bg|text)-(primary|base-200|white|base-content)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
