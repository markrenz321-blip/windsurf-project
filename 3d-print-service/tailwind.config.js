/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(17, 24, 39)',
        foreground: 'rgb(243, 244, 246)',
        primary: 'rgb(99, 102, 241)',
        'primary-foreground': 'rgb(243, 244, 246)',
        secondary: 'rgb(31, 41, 55)',
        'secondary-foreground': 'rgb(243, 244, 246)',
        muted: 'rgb(31, 41, 55)',
        'muted-foreground': 'rgb(156, 163, 175)',
        accent: 'rgb(55, 65, 81)',
        'accent-foreground': 'rgb(243, 244, 246)',
        border: 'rgb(55, 65, 81)',
        input: 'rgb(31, 41, 55)',
        ring: 'rgb(99, 102, 241)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
