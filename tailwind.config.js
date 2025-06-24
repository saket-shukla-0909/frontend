/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // very important
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // use require()
};
