/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kisaan-green': {
          lightest: '#dcfce7',
          light: '#4ade80',
          DEFAULT: '#22c55e',
          dark: '#16a34a',
          darkest: '#14532d',
        },
        'kisaan-yellow': {
          lightest: '#fef9c3',
          light: '#fde047',
          DEFAULT: '#eab308',
          dark: '#ca8a04',
          darkest: '#854d0e',
        },
      },
      backgroundImage: {
        'gradient-green-yellow': 'linear-gradient(135deg, #22c55e 0%, #eab308 100%)',
        'gradient-yellow-green': 'linear-gradient(135deg, #eab308 0%, #22c55e 100%)',
      },
    },
  },
  plugins: [],
} 