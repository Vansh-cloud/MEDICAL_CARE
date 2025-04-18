/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F7FF',
          100: '#B3E5FC',
          200: '#81D4FA',
          300: '#4FC3F7',
          400: '#29B6F6',
          500: '#0891B2', // Primary color
          600: '#0E7490',
          700: '#0E6677',
          800: '#0C4A6E',
          900: '#0A3854',
        },
        secondary: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#16A34A', // Secondary color
          600: '#0B8A3A',
          700: '#07702E',
          800: '#046024',
          900: '#014D1B',
        },
        accent: {
          50: '#FFF0E5',
          100: '#FFD6B8',
          200: '#FFBB8A',
          300: '#FFA05C',
          400: '#FF8A3E',
          500: '#FF7420', // Accent color
          600: '#E66200',
          700: '#CC5700',
          800: '#A34500',
          900: '#803700',
        },
        danger: '#EF4444',
        warning: '#FBBF24',
        success: '#22C55E',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Montserrat"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};