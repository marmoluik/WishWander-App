/** @type {import('tailwindcss').Config} */

// Inline theme tokens so this config does not require `ts-node`
// when executed by tooling like Expo or Tailwind CLI.
const tailwindColors = {
  primary: '#312e81', // deep indigo
  surface: '#fdfcf9', // warm cream
  cardBg: '#ffffff',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  accent: '#0d9488',
  error: '#ef4444',
};

const tailwindFontSizes = {
  heading: ['24px', '32px'],
  subtitle: ['18px', '24px'],
  body: ['14px', '20px'],
};

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: tailwindColors,
      fontSize: tailwindFontSizes,
    },
  },
  plugins: [],
}