import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        signal: {
          // Exact colors from Signal Desktop _variables.scss & tailwind-config.css
          'ultramarine':      '#2C6BED', // $color-ultramarine - outgoing bubble
          'ultramarine-dark': '#1851B4', // $color-ultramarine-dark
          'ultramarine-logo': '#3B45FD', // $color-ultramarine-logo
          'accent-blue':      '#2C6BED',
          'accent-green':     '#4CAF50',
          'accent-red':       '#F44336',

          // Gray scale (exact from Signal)
          'gray-02':  '#F6F6F6',
          'gray-04':  '#F0F0F0',
          'gray-05':  '#E9E9E9',
          'gray-15':  '#DEDEDE',
          'gray-20':  '#C6C6C6',
          'gray-25':  '#B9B9B9',
          'gray-40':  '#808080',
          'gray-45':  '#848484',
          'gray-60':  '#5E5E5E',
          'gray-65':  '#4A4A4A',
          'gray-75':  '#3B3B3B', // incoming bubble dark
          'gray-78':  '#343434',
          'gray-80':  '#2E2E2E',
          'gray-85':  '#262626', // secondary background
          'gray-90':  '#1B1B1B', // nav rail background
          'gray-95':  '#121212',

          // Semantic tokens matching Signal's tailwind-config.css dark theme
          'bg-primary':   '#1A1A1A', // --color-background-primary dark
          'bg-secondary': '#262626', // --color-background-secondary dark
          'bg-elevated':  '#2A2A2A', // --color-elevated-background-primary dark
          'bg-elevated-2':'#323232', // --color-elevated-background-secondary dark
          'bg-elevated-3':'#3A3A3A', // --color-elevated-background-tertiary dark

          // Message bubbles (exact from Signal)
          'bubble-out':     '#2C6BED', // outgoing = ultramarine
          'bubble-in':      '#3B3B3B', // incoming = gray-75

          // Nav
          'rail':       '#1B1B1B', // nav tabs rail = gray-90
          'sidebar':    '#1A1A1A', // left pane bg
          'hover':      '#2A2A2A', // elevated-primary
          'selected':   '#3A3A3A', // elevated-tertiary
          'surface':    '#2A2A2A',

          // Text (from Signal label tokens)
          'text-primary':   '#FFFFFF',
          'text-secondary': 'rgba(255,255,255,0.55)', // --color-label-secondary dark
          'text-muted':     'rgba(255,255,255,0.30)', // --color-label-placeholder dark
          'text-disabled':  'rgba(255,255,255,0.20)', // --color-label-disabled dark

          // Borders
          'divider':    'rgba(255,255,255,0.08)', // --color-border-secondary dark
          'border':     'rgba(255,255,255,0.16)', // --color-border-primary dark

          // Unread badge
          'unread':     '#2C6BED', // Signal uses ultramarine for unread badges

          // Tick colors
          'tick-sent':       'rgba(255,255,255,0.55)',
          'tick-delivered':  'rgba(255,255,255,0.55)',
          'tick-read':       '#89B4F8', // Signal blue tint for read receipts

          // Call background
          'calling-bg': '#1B1B1B',
        }
      },
      fontFamily: {
        // Exact font stack from Signal Desktop _variables.scss $inter
        sans: ['Inter', 'Source Sans Pro', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'SFMono-Regular', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        // Signal's message bubble radius
        'bubble': '18px',
        'bubble-sm': '4px',
      },
      fontSize: {
        // From Signal's tailwind-config.css type system
        'signal-title-lg': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.019em', fontWeight: '600' }],
        'signal-title-md': ['1.125rem', { lineHeight: '1.5rem', letterSpacing: '-0.014em', fontWeight: '600' }],
        'signal-title-sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.006em', fontWeight: '600' }],
        'signal-body-lg':  ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.006em' }],
        'signal-body-md':  ['0.8125rem', { lineHeight: '1.125rem', letterSpacing: '-0.003em' }],
        'signal-body-sm':  ['0.75rem', { lineHeight: '1rem' }],
        'signal-caption':  ['0.6875rem', { lineHeight: '0.875rem', letterSpacing: '0.005em' }],
      },
    },
  },
  plugins: [],
};
export default config;
