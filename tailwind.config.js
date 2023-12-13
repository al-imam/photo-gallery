/* eslint-disable global-require, import/no-extraneous-dependencies */

const defaultTheme = require('tailwindcss/defaultTheme')

const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette')
const { parseColor } = require('tailwindcss/lib/util/color')

function generateTimes() {
  return Array(100)
    .fill(null)
    .map((_, i) => i + 1)
    .reduce((a, v) => ({ ...a, [`${v}s`]: `${v * 1000}ms` }), {})
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    'components/**/*.{ts,tsx}',
    'shadcn/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },

    extend: {
      __colors: ({ theme }) => {
        const flatPalette = flattenColorPalette(theme('colors'))

        return Object.fromEntries(
          Object.entries(flatPalette)
            .map(([key, value]) => [key, parseColor(value)?.color.join(' ')])
            .filter(([, value]) => value)
        )
      },

      transitionDuration: generateTimes(),
      transitionDelay: generateTimes(),

      colors: {
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        ring: 'rgb(var(--ring))',
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          foreground: 'rgb(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary))',
          foreground: 'rgb(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive))',
          foreground: 'rgb(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          foreground: 'rgb(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          foreground: 'rgb(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover))',
          foreground: 'rgb(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'rgb(var(--card))',
          foreground: 'rgb(var(--card-foreground))',
        },

        link: {
          DEFAULT: 'rgb(var(--link))',
          muted: 'rgb(var(--link-muted))',
        },

        shade: {
          DEFAULT: 'rgb(var(--shade-0))',
          'p-500': 'rgb(var(--shade-p-500))',
          'p-400': 'rgb(var(--shade-p-400))',
          'p-300': 'rgb(var(--shade-p-300))',
          'p-200': 'rgb(var(--shade-p-200))',
          'p-100': 'rgb(var(--shade-p-100))',
          0: 'rgb(var(--shade-0))',
          'n-100': 'rgb(var(--shade-n-100))',
          'n-200': 'rgb(var(--shade-n-200))',
          'n-300': 'rgb(var(--shade-n-300))',
          'n-400': 'rgb(var(--shade-n-400))',
          'n-500': 'rgb(var(--shade-n-500))',
        },

        success: 'rgb(var(--success))',
        failure: 'rgb(var(--failure))',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },

        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },

      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-mark-pro)', ...defaultTheme.fontFamily.sans],
      },

      backgroundImage: {
        'gradient-radial':
          'radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('tailwindcss-debug-screens'),
    require('tailwindcss-animate'),
    require('tailwind-layout')({
      gap: {
        DEFAULT: '1rem',
        md: '2rem',
      },
    }),
  ],
}
