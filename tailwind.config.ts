import type { Config } from 'tailwindcss';

export default {
  content: ['./**/*.{html,js,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
        muted: 'var(--muted-soft)',
        link: 'var(--link)',
        glass: 'var(--glass)',
        'glass-hover': 'var(--glass-hover)',
        'glass-active': 'var(--glass-active)',
        'glass-border': 'var(--glass-border)',
        'surface-card': 'var(--surface-card)',
        'surface-elevated': 'var(--surface-elevated)',
        hairline: 'var(--hairline)',
        'hairline-strong': 'var(--hairline-strong)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        pill: 'var(--radius-pill)',
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        xxl: 'var(--space-xxl)',
        section: 'var(--space-section)',
        gutter: 'var(--page-gutter)',
      },
      boxShadow: {
        e1: 'var(--elevation-1)',
        e2: 'var(--elevation-2)',
        e3: 'var(--elevation-3)',
        e4: 'var(--elevation-4)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        spring: 'var(--ease-spring)',
        bounce: 'var(--ease-bounce)',
      },
      fontSize: {
        hero: 'var(--text-hero)',
        display: 'var(--text-display)',
      },
      maxWidth: {
        content: 'var(--max-width)',
      },
    },
  },
} satisfies Config;
