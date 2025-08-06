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
        primary: "#2563EB",
        secondary: "#9333EA",
        background: "#F3F4F6",
        "text-primary": "#1F2937",
        accent: "#F59E0B",
        "accent-hover": "#D97706",
        success: "#22C55E",
        alert: "#EF4444",
      },
    },
  },
  plugins: [],
}