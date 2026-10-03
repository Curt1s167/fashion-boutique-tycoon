/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Baloo 2"', 'Quicksand', 'system-ui', 'sans-serif'],
        heading: ['"Baloo 2"', 'Fredoka', 'Quicksand', 'cursive', 'sans-serif'],
        baloo: ['"Baloo 2"', 'cursive', 'sans-serif'],
      },
      colors: {
        pastel: {
          pink: '#FFB5D5',
          rose: '#FFA4C4',
          lavender: '#E8D5FF',
          purple: '#C4B5FD',
          mint: '#B9FBC0',
          emerald: '#A7F3D0',
          peach: '#FFDAC1',
          cream: '#FFF9F0',
          yellow: '#FDE68A',
          blue: '#BAE6FD',
          indigo: '#C7D2FE',
          card: '#FFF5F8',
          dark: '#3D314A',
          accent: '#FF4D8D',
        },
        nini: {
          pink: '#FDA0A2',
          pinkSoft: '#FFB7B2',
          peach: '#FCC7A1',
          cream: '#FAE2D2',
          tan: '#DDAA8C',
          cocoa: '#936451',
          cocoaDark: '#5B3B33',
          mint: '#BAD5BC',
          blue: '#D0E0E2',
          bg: '#FFF7F3',
          surface: '#FFF7F3',
          surfaceStrong: '#FFE9E5',
          text: '#5B3B33',
          textMuted: '#8B6A60',
          success: '#97C8A4',
          warning: '#F2C879',
          danger: '#E98282',
        },
        arcade: {
          pink: '#FF2E93',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          gold: '#F59E0B',
          green: '#10B981',
        }
      },
      boxShadow: {
        'game-btn': '0 6px 0 0 #D946EF, 0 10px 15px -3px rgba(0, 0, 0, 0.2)',
        'game-btn-pink': '0 6px 0 0 #DB2777, 0 10px 15px -3px rgba(219, 39, 119, 0.3)',
        'game-btn-gold': '0 6px 0 0 #D97706, 0 10px 15px -3px rgba(217, 119, 6, 0.3)',
        'game-btn-green': '0 6px 0 0 #059669, 0 10px 15px -3px rgba(5, 150, 105, 0.3)',
        'game-btn-blue': '0 6px 0 0 #2563EB, 0 10px 15px -3px rgba(37, 99, 235, 0.3)',
        'game-card': '0 10px 25px -5px rgba(244, 114, 182, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'game-card-3d': '0 8px 0 0 #F472B6, 0 15px 25px rgba(0,0,0,0.1)',
        'inner-soft': 'inset 0 2px 6px rgba(255,255,255,0.6)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(255, 77, 141, 0.6))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 16px rgba(255, 77, 141, 0.9))' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        bounceShort: 'bounceShort 1s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
