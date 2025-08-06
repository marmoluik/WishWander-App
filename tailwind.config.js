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
        primary: "#7C3AED",
        secondary: "#E9D5FF",
        background: "#FAF5FF",
        "text-primary": "#1E1B4B",
        accent: "#8B5CF6",
        "accent-hover": "#6D28D9",
        success: "#22C55E",
        alert: "#EF4444",
      },
    },
  },
  plugins: [],
}