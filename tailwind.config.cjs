const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    colors: {
      black: '#121b2a',       // Main background
      white: '#e0e0e0',       // Main text color
      orange: '#4dd8e6',      // Primary accent color (teal)
      darkBg: '#0a1525',      // Header background
      darkAccent: '#2b6c9e',  // Secondary accent color
      darkGray: '#2a3a4a',    // Border color
      codeGray: '#1a2639',    // Code background
      transparent: 'transparent',
    },
    fontFamily: {
      // Headings
      sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      // Base text
      monospace: ['Inconsolata', 'monospace'],
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    letterSpacing: {
      wide: '.025em',
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h2: {
          letterSpacing: theme('letterSpacing.wide'),
          fontWeight: 'bold',
        },
        li: {
          letterSpacing: theme('letterSpacing.wide'),
        },
      });
    }),
  ],
};