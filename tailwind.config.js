/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.25rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        brand: {
          olive: '#66752E',
          'dark-olive': '#4F5B22',
          gold: '#D4A63A',
          cream: '#F8F4EC',
          beige: '#E9DFC9',
          brown: '#8B6A45',
        },
      },
      fontFamily: {
        body: ['Cairo', 'sans-serif'],
        display: ['Baloo 2', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 14px 35px -18px rgba(79, 91, 34, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
