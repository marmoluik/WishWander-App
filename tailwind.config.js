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
        secondary: "#14B8A6",
        background: "#F9FAFB",
        "text-primary": "#111827",
        accent: "#8B5CF6",
        "accent-hover": "#7C3AED",
        success: "#22C55E",
        alert: "#EF4444",
      },
    },
  },
  plugins: [],
};