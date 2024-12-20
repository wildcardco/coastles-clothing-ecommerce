module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        'coastles': {
          50: '#f7f7f7',   // Lightest gray
          100: '#e6e6e6',  // Very light gray
          200: '#d4d4d4',  // Light gray
          300: '#b0b0b0',  // Medium light gray
          400: '#888888',  // Medium gray
          500: '#666666',  // Gray
          600: '#444444',  // Medium dark gray
          700: '#333333',  // Dark gray
          800: '#222222',  // Very dark gray
          900: '#111111',  // Almost black
          950: '#000000',  // Pure black
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Modern, sleek font
      },
    }
  },
  plugins: []
}