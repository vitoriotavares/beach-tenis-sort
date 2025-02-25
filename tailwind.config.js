/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Cores inspiradas em praia e sol
        sand: {
          50: '#FDFCFB',
          100: '#F7F3EF',
          200: '#F0E6DB',
          300: '#E5D4C3',
          400: '#D4BBA3',
          500: '#C4A285',
          600: '#B38E6D',
          700: '#96735A',
          800: '#785C48',
          900: '#5C4637',
        },
        ocean: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#B9E6FE',
          300: '#7CD4FD',
          400: '#36BFFA',
          500: '#0BA5EC',
          600: '#0086C9',
          700: '#026AA2',
          800: '#065986',
          900: '#0B4A6F',
        },
        sunset: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#B9E6FE',
          300: '#7CD4FD',
          400: '#36BFFA',
          500: '#0BA5EC',
          600: '#0086C9',
          700: '#026AA2',
          800: '#065986',
          900: '#0B4A6F',
        },
      },
      backgroundImage: {
        'gradient-sand': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}