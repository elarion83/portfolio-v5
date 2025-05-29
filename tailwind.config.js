/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f59e0b', // Increased contrast from #e28d1d
          light: '#fbbf24',
          dark: '#d97706',
        },
        secondary: {
          DEFAULT: '#1a1333', // Darker background for better contrast
          light: '#2d1f54',
          dark: '#110c22',
        },
        accent: {
          DEFAULT: '#22c55e', // Adjusted for better contrast
          light: '#4ade80',
          dark: '#16a34a',
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#cbd5e1', // Lighter text for better contrast
            a: {
              color: '#f59e0b',
              '&:hover': {
                color: '#fbbf24',
              },
            },
            h1: {
              color: '#ffffff',
            },
            h2: {
              color: '#ffffff',
            },
            h3: {
              color: '#ffffff',
            },
            h4: {
              color: '#ffffff',
            },
            strong: {
              color: '#ffffff',
            },
            code: {
              color: '#f59e0b',
            },
            blockquote: {
              color: '#cbd5e1',
              borderLeftColor: '#f59e0b',
            },
          },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};