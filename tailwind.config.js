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
        primary: "#3B82F6",
        secondary: "#10B981",
        background: "#F9FAFB",
        "text-primary": "#1F2937",
        accent: "#6366F1",
        "accent-hover": "#4F46E5",
        success: "#22C55E",
        alert: "#EF4444",
      },
    },
  },
  plugins: [],
}