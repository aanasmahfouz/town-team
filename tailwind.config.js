/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A0A0A',
          light: '#1A1A1A',
        },
        accent: {
          DEFAULT: '#E8FF6C',
          secondary: '#6C8CFF',
          tertiary: '#FF6C8C',
        },
        background: '#000000',
      },
      fontFamily: {
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Space Grotesk', 'hkgroteskwide-bold', 'sans-serif'],
        brand: ['hkgroteskwide-bold', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
      },
    },
  },
  plugins: [],
}
