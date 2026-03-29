export type ThemeMode = 'light' | 'dark';

export const fonts = {
  heading: '"Sora", "Inter", "Segoe UI", sans-serif',
  body: '"Inter", "Segoe UI", sans-serif',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const brand = {
  primary: '#3d5afe',
  primaryDark: '#1d2f8f',
  primaryLight: '#6c7bff',
  secondary: '#ff9100',
  secondaryDark: '#f57c00',
  accent: '#4e72df',
};

export const semantic = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const neutral = {
  light: {
    bg: '#f5f7fa',
    surface: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    border: '#e2e8f0',
  },
  dark: {
    bg: '#0f1724',
    surface: '#1b2433',
    textPrimary: '#f8fafc',
    textSecondary: '#b6c2cf',
    border: '#334155',
  },
};

export const shadows = {
  light: {
    card: '0 10px 30px rgba(15, 23, 42, 0.08)',
    elevated: '0 16px 40px rgba(15, 23, 42, 0.14)',
  },
  dark: {
    card: '0 10px 30px rgba(3, 8, 20, 0.38)',
    elevated: '0 18px 44px rgba(3, 8, 20, 0.5)',
  },
};

export const motion = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  regular: '220ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '320ms cubic-bezier(0.4, 0, 0.2, 1)',
};
