import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safelist: [
    `lg:mt-${process.env.HEADER_HEIGHT}`,
    `mt-${process.env.HEADER_HEIGHT_MOBILE}`,
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      backgroundImage: {
        buttonGradient:
          'linear-gradient(90deg, #F86DEC 0%, #7F7FF4 50%, #FFBF00 100%)',
        sidebarGradient:
          'linear-gradient(to bottom, rgb(11, 49, 65), rgb(9, 48, 65), rgb(19, 58, 78), rgb(15, 54, 72), rgb(22, 62, 82),rgb(24, 80, 101), rgb(30, 81, 104), rgb(31, 78, 102), rgb(30, 74, 97), rgb(26, 67, 89), rgb(44, 72, 85), rgb(40, 85, 107))',
      },
      boxShadow: {
        heroCardShadow: '0 4px 10px 0 hsl(var(--hero-card-shadow))',
        otpShadow: '0 1.7px 0 0 rgb(113, 107, 107)',
        otpShadowActive: '0 1.7px 0 0 hsl(var(--primary))',
      },
      letterSpacing: {
        description: '0.16em',
        password: '0.125em',
      },
      colors: {
        border: {
          DEFAULT: 'hsl(var(--border))',
          input: 'hsl(var(--border-input))',
        },
        label: 'hsl(var(--label))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        otp: 'hsl(var(--otp))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary)) !important',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          button: 'hsl(var(--primary))',
          googleButton: 'hsl(var(--card-google-button))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        hero: {
          description: 'hsl(var(--hero-description))',
          lightbrown: 'hsl(var(--hero-lightbrown))',
          lightgreen: 'hsl(var(--hero-lightgreen))',
          white: 'hsl(var(--hero-white))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      width: {
        inherit: 'inherit',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
