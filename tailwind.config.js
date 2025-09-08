/** @type {import('tailwindcss').Config} */
require('ts-node').register();
const { tailwindColors } = require('./src/theme/colors');
const { tailwindFontSizes } = require('./src/theme/typography');

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: tailwindColors,
      fontSize: tailwindFontSizes,
    },
  },
  plugins: [],
}