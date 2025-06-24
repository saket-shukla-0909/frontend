/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ All React component files
    "./public/index.html",         // Optional but safe
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
