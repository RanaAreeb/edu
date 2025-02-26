// tailwind.config.mjs
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.{css}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',    // Green (Primary branding color)
        accent: '#FF5722',     // Red (Accent color for highlights)
        background: '#FFEB3B', // Yellow (Background color)
        lightGreen: '#81C784', // Light Green (Secondary elements)
        lightYellow: '#FFEE58', // Light Yellow (Subtle background highlights)
        darkGreen: '#2C6A4F',  // Dark Green (Text or darker elements)
        text: '#2C3E50',       // Dark Text (Primary text color)
      },
    },
  },
  plugins: [],
};