module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Update this path according to your project
  ],
  theme: {
    extend: {
      animation: {
        'zoom-in': 'zoomIn 1s ease-in-out forwards',
      },
      keyframes: {
        zoomIn: {
          '0%': {
            transform: 'scale(0.9)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [
    
    require('tailwind-scrollbar-hide'),
  ],
};
