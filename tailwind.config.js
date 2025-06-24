// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  safelist: [
  "chat", "chat-start", "chat-end", "chat-bubble", "chat-bubble-info",
  "bg-white", "bg-gray-900", "text-white"
  ],

  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
