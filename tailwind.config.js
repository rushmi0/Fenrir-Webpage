/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': { 'max': '470px' },
      'sm': '640px',  // => @media (min-width: 640px) { ... }
      'md': '470px',  // => @media (min-width: 768px) { ... }
      'ms': '755px',
      'lg': '1024px', // => @media (min-width: 1024px) { ... }
      'xl': '1280px', // => @media (min-width: 1280px) { ... }
      '2xl': '1536px', // => @media (min-width: 1536px) { ... }
    },
    extend: {
      rotate: {
        '30': '30deg',
      },
      backgroundImage: {
        'box-label': "url(assets/svg_pixel.svg)",
        'bg-mobile': "url(assets/bg.svg)",
        'bg-pc': "url(assets/bgpc.svg)",
      }
    },
  },
  plugins: [],
}
