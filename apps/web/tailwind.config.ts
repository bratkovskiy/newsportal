import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--c-bg)',
        foreground: 'var(--c-fg)',
        accent: 'var(--c-accent)',
        muted: 'var(--c-muted)',
        border: 'var(--c-border)',
        success: 'var(--c-success)',
        danger: 'var(--c-danger)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
      fontSize: {
        sm: 'var(--fs-sm)',
        base: 'var(--fs-base)',
        lg: 'var(--fs-lg)',
        xl: 'var(--fs-xl)',
        '2xl': 'var(--fs-2xl)',
        '3xl': 'var(--fs-3xl)',
      },
      borderRadius: {
        card: 'var(--r-card)',
        button: 'var(--r-button)',
        image: 'var(--r-image)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        sm: 'var(--shadow-sm)',
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
      },
    },
  },
  plugins: [],
} satisfies Config;
