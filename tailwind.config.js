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
        primary: "#F4C430",
        secondary: "#FFB347",
        background: "#FFFBF0",
        "text-primary": "#2E2A1C",
        accent: "#4A90E2",
        "accent-hover": "#D19C1D",
        success: "#B3E283",
        alert: "#F76C5E",
      },
    },
  },
  plugins: [],
}