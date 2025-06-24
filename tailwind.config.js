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
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // ✅ Tell Tailwind where to scan for classes
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // ✅ Enable DaisyUI
}
