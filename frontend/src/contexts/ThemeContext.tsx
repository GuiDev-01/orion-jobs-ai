import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { alpha } from '@mui/material/styles';
import {
  brand,
  fonts,
  motion,
  neutral,
  radii,
  semantic,
  spacing,
} from '@/theme/tokens';
import { getGlassCardStyle, getPageBackground } from '@/theme/styles';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleTheme: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeMode = () => useContext(ThemeContext);

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: brand.primary,
            light: brand.primaryLight,
            dark: brand.primaryDark,
          },
          secondary: {
            main: brand.secondary,
            light: '#ffab40',
            dark: brand.secondaryDark,
          },
          background: {
            default: mode === 'dark' ? neutral.dark.bg : neutral.light.bg,
            paper: mode === 'dark' ? neutral.dark.surface : neutral.light.surface,
          },
          text: {
            primary: mode === 'dark' ? neutral.dark.textPrimary : neutral.light.textPrimary,
            secondary: mode === 'dark' ? neutral.dark.textSecondary : neutral.light.textSecondary,
          },
          success: {
            main: semantic.success,
            light: '#34d399',
            dark: '#059669',
          },
          warning: {
            main: semantic.warning,
            light: '#fbbf24',
            dark: '#d97706',
          },
          error: {
            main: semantic.error,
            light: '#f87171',
            dark: '#dc2626',
          },
          info: {
            main: semantic.info,
            light: '#60a5fa',
            dark: '#2563eb',
          },
          divider: mode === 'dark' ? alpha(neutral.dark.border, 0.8) : neutral.light.border,
        },
        typography: {
          fontFamily: fonts.body,
          h1: {
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontFamily: fonts.heading,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          },
          h2: {
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontFamily: fonts.heading,
            fontWeight: 700,
            letterSpacing: '-0.015em',
          },
          h3: {
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
            fontFamily: fonts.heading,
            fontWeight: 700,
            letterSpacing: '-0.012em',
          },
          h4: {
            fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)',
            fontFamily: fonts.heading,
            fontWeight: 700,
          },
          h6: {
            fontSize: '1.1rem',
            fontFamily: fonts.heading,
            fontWeight: 600,
          },
          body1: {
            fontSize: '0.95rem',
            lineHeight: 1.6,
            letterSpacing: '-0.005em',
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
            letterSpacing: '-0.005em',
          },
        },
        shape: {
          borderRadius: radii.lg,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background: getPageBackground(mode),
                minHeight: '100vh',
              },
              '#root': {
                minHeight: '100vh',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: getGlassCardStyle(mode),
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                letterSpacing: '0.01em',
                borderRadius: radii.md,
                transition: `all ${motion.regular}`,
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 500,
                borderRadius: radii.sm,
              },
            },
          },
          MuiContainer: {
            defaultProps: {
              maxWidth: 'xl',
            },
          },
          MuiCardContent: {
            styleOverrides: {
              root: {
                padding: spacing.xl,
                '&:last-child': {
                  paddingBottom: spacing.xl,
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}