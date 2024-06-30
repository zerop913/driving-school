/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: "#FF6B00",
        gray: {
          light: "#F3F4F6",
          dark: "#4B5563",
        },
      },
    },
  },
  plugins: [],
};
