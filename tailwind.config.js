/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './components/**/*.{js,ts,jsx,tsx}', './data/**/*.{js,ts,jsx,tsx}', './domain/**/*.{js,ts,jsx,tsx}', './utils/**/*.{js,ts,jsx,tsx}', './views/**/*.{js,ts,jsx,tsx}', './*.{js,ts,jsx,tsx}'],
  theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] }, colors: { notebook: { 950: '#07111f', 900: '#0b1726', 800: '#0e1c2d' } } } },
  plugins: [],
};
