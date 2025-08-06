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
        primary: "#4BBFD9",
        secondary: "#3DDC97",
        background: "#FAFAFA",
        "text-primary": "#1F2D3D",
        accent: "#FF6B6B",
        "accent-hover": "#2BAF7D",
        success: "#D1F5E1",
        error: "#FDE2E1",
      },
    },
  },
  plugins: [],
}