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
        primary: "#F59E0B",
        secondary: "#FDE68A",
        background: "#F8FAFC",
        "text-primary": "#1F2937",
        accent: "#D97706",
        "accent-hover": "#B45309",
        success: "#22C55E",
        alert: "#EF4444",
      },
    },
  },
  plugins: [],
}