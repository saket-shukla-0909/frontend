// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],  // ✅ important for React
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // optional, only if you use DaisyUI
};

