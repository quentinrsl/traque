/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
      colors: {
      "orange" : "#F27127",
      "white" : "#FFFFFF",
      "gray" : "#333333",
      "dark-blue" : "#13274A",
      "light-blue" : "#2957A3",
      }
  },
  fontFamily: {
    sans: ["Inter", "sans-serif"],
    serif: ["Merriweather", "serif"],
  },
  plugins: [],
};
