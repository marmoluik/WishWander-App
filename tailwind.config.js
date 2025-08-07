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
        primary: "#9C00FF",
        secondary: "#DE00FF",
        background: "#F9F5FF",
        "text-primary": "#1E1B4B",
        accent: "#B347FF",
        "accent-hover": "#7F00CC",
        success: "#22C55E",
        alert: "#EF4444",
      },
    },
  },
  plugins: [],
}