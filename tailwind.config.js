/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        "book-bg": "url('/images/book-bg.png')",
        "chooseus-bg": "url('/images/chooseus-bg.png')",
        "faq-bg": "url('/images/faq-bg.png')",
        'hero-bg': "url('/images/hero-bg.png')"
      },
      colors: {
        "black-100": "#2B2C35",
        "primary-blue": {
          DEFAULT: "#2B59FF",
          100: "#F5F8FF",
          colors: {
            "custom-white": "#f8f8f8",
            "custom-blue": "#0077b6",
            "custom-grey": "#706f7b",
            "custom-maroon": "#721c24",
            "custom-pink": "#f8d7da",
            "light-green": "#c3fabe",
            "lighter-black": "#333",
            "lighter-grey": "#dbdbdb",
            "lightest-grey": "#ccd7e6",
            "dark-green": "#2a6817",
            "dark-grey": "#777",
          },
        },
        "secondary-orange": "#f79761",
        "light-white": {
          DEFAULT: "rgba(59,60,152,0.03)",
          100: "rgba(59,60,152,0.02)",
        },
        grey: "#747A88",
      },
      boxShadow: {
        "orange-bottom": "0 10px 15px 0 rgba(255,83,48,.35);",
        "orange-bottom-hov": "0 10px 15px 0 rgba(255,83,48,.6);",
        "white-box": "0 10px 20px 0 rgba(0,0,0,.1)",
        "faq-divider": "0 1px 3px 0 rgba(0,0,0,.1);",
      },
      gridTemplateColumns: {
        fluid: "repeat(auto-fit, minmax(15rem, 1fr));",
      },

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],

  variants: {
    extend: {
      // Inclure les icônes de Font Awesome
      opacity: ['responsive', 'hover', 'focus', 'disabled'],
    },
  },
}
