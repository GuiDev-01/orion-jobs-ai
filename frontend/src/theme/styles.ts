import { alpha } from '@mui/material/styles';
import type { ThemeMode } from './tokens';
import { brand, radii, shadows } from './tokens';

export const getPageBackground = (mode: ThemeMode): string => {
  if (mode === 'dark') {
    return 'radial-gradient(1200px 500px at 10% -5%, rgba(61, 90, 254, 0.18), transparent 55%), radial-gradient(900px 400px at 100% 0%, rgba(255, 145, 0, 0.12), transparent 50%), #0b1220';
  }

  return 'radial-gradient(1100px 500px at 15% -10%, rgba(61, 90, 254, 0.11), transparent 55%), radial-gradient(900px 350px at 100% 0%, rgba(255, 145, 0, 0.12), transparent 50%), #f4f7fb';
};

export const getGlassCardStyle = (mode: ThemeMode) => ({
  backgroundImage: 'none',
  backgroundColor: mode === 'dark' ? alpha('#1b2433', 0.76) : alpha('#ffffff', 0.86),
  backdropFilter: 'blur(14px)',
  border: `1px solid ${mode === 'dark' ? alpha('#cbd5e1', 0.1) : alpha(brand.primary, 0.12)}`,
  boxShadow: mode === 'dark' ? shadows.dark.card : shadows.light.card,
  borderRadius: radii.lg,
  transition: `transform 220ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 220ms cubic-bezier(0.4, 0, 0.2, 1), border-color 220ms cubic-bezier(0.4, 0, 0.2, 1)`,
});

export const getAppBarStyle = (mode: ThemeMode) => ({
  backdropFilter: 'blur(12px)',
  background: mode === 'dark'
    ? 'linear-gradient(135deg, rgba(15, 23, 36, 0.96) 0%, rgba(27, 36, 51, 0.94) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.93) 0%, rgba(246, 249, 252, 0.95) 100%)',
  borderBottom: `1px solid ${mode === 'dark' ? alpha('#cbd5e1', 0.1) : alpha(brand.primary, 0.12)}`,
  boxShadow: mode === 'dark' ? '0 8px 24px rgba(2, 8, 20, 0.35)' : '0 8px 24px rgba(15, 23, 42, 0.08)',
});
