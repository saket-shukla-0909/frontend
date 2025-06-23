// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  safelist: [
    "chat",
    "chat-start",
    "chat-end",
    "chat-bubble",
    "chat-bubble-info",
    "bg-primary",
    "bg-base-200",
    "text-white",
    "text-base-content"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
