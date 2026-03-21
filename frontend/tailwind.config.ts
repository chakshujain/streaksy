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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out both',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.3s ease-out both',
        'scale-in': 'scale-in 0.3s ease-out both',
        'node-pulse': 'node-pulse 1.5s ease-in-out infinite',
        'edge-draw': 'edge-draw 0.6s ease-out forwards',
        'cell-fill': 'cell-fill 0.3s ease-out forwards',
        'push-in': 'push-in 0.3s ease-out',
        'pop-out': 'pop-out 0.3s ease-in',
        'ring-pulse': 'ring-pulse 1s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.15), 0 0 30px rgba(16, 185, 129, 0.05)',
          },
          '50%': {
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.3), 0 0 50px rgba(16, 185, 129, 0.1)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'node-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.3))' },
          '50%': { filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.6))' },
        },
        'edge-draw': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        'cell-fill': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'push-in': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pop-out': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-20px)', opacity: '0' },
        },
        'ring-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.4)' },
          '50%': { boxShadow: '0 0 0 6px rgba(16,185,129,0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
