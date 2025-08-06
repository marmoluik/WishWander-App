/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
      extend: {
        fontFamily: {
          outfit: ["outfit", "sans-serif"],
          "outfit-medium": ["outfit-medium", "sans-serif"],
          "outfit-bold": ["outfit-bold", "sans-serif"],
        },
        colors: {
          pink: {
            50: "#FFF5FA",
            100: "#FFE9F2",
            200: "#FFD2E6",
            300: "#FFB3D4",
            400: "#FF9AC2",
            500: "#FF4698",
            600: "#FE187E",
            700: "#E80067",
          },
        },
      },
    },
  plugins: [],
}