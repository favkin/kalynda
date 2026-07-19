/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#F7E9E6',
        'blush-deep': '#F0D6D0',
        ink: '#241016',
        line: '#E8CFC9',
        plum: {
          DEFAULT: '#3B0F1F',
          light: '#5A1B33',
          dark: '#240912'
        },
        gloss: {
          DEFAULT: '#E24B67',
          light: '#EC7189',
          dark: '#C13052'
        },
        gold: {
          DEFAULT: '#C9A24B',
          light: '#DABD75'
        },
        studio: {
          DEFAULT: '#2B0E1B',
          raised: '#3A1526',
          line: '#4C2033'
        },
        rust: '#B34A3A'
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'serif'],
        body: ['"Manrope"', 'sans-serif']
      },
      borderRadius: {
        tag: '4px'
      }
    }
  },
  plugins: []
};
