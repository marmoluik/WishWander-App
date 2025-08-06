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
        background: "#F9FAFB",
        "text-primary": "#1F2937",
        accent: "#F97316",
        "accent-hover": "#EA580C",
        success: "#10B981",
        alert: "#EF4444",
      },
    },
  },
  plugins: [],
}