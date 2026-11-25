/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: 'rgb(var(--bg-cream-rgb) / <alpha-value>)',
        'cream-deep': 'rgb(var(--bg-cream-deep-rgb) / <alpha-value>)',
        parchment: 'rgb(var(--bg-cream-deep-rgb) / <alpha-value>)',
        card: 'rgb(var(--bg-card-rgb) / <alpha-value>)',
        espresso: 'rgb(var(--text-espresso-rgb) / <alpha-value>)',
        mocha: 'rgb(var(--text-mocha-rgb) / <alpha-value>)',
        moka: 'rgb(var(--text-mocha-rgb) / <alpha-value>)',
        muted: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
        divider: 'rgb(var(--border-divider-rgb) / <alpha-value>)',
        olive: 'rgb(var(--accent-olive-rgb) / <alpha-value>)',
        'olive-envelope': 'rgb(var(--surface-olive-envelope-rgb) / <alpha-value>)',
        'olive-envelope-dark': 'rgb(var(--surface-olive-envelope-dark-rgb) / <alpha-value>)',
        sage: 'rgb(var(--swatch-sage-rgb) / <alpha-value>)',
        burgundy: 'rgb(var(--accent-burgundy-rgb) / <alpha-value>)',
        'burgundy-hover': 'rgb(var(--accent-burgundy-hover-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        script: ['Pinyon Script', 'cursive'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
    },
  },
  plugins: [],
};
