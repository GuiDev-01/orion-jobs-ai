import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleTheme: () => {},
});

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
            main: '#304ffe', // Azul espacial vibrante
            light: '#7c4dff', // Roxo nebulosa
            dark: '#1a237e', // Azul noturno profundo
          },
          secondary: {
            main: '#ffa726', // Dourado estelar
            light: '#ffb74d', // Âmbar brilhante
            dark: '#f57c00', // Laranja profundo
          },
          background: {
            default: mode === 'dark' ? '#0a1929' : '#f5f5f5',
            paper: mode === 'dark' ? '#132f4c' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#ffffff' : '#1a237e',
            secondary: mode === 'dark' ? '#b0bec5' : '#546e7a',
          },
          success: {
            main: '#66bb6a',
          },
          info: {
            main: '#7c4dff',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '3rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffa726 0%, #ffb74d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          },
          h2: {
            fontSize: '2.5rem',
            fontWeight: 600,
            color: '#304ffe',
          },
          h4: {
            fontSize: '2rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          },
          h6: {
            fontSize: '1.25rem',
            fontWeight: 600,
          },
          body1: {
            fontSize: '1rem',
          },
          body2: {
            fontSize: '0.875rem',
          },
        },
        shape: {
          borderRadius: 16,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                backgroundColor: mode === 'dark' ? 'rgba(19, 47, 76, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 12,
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 500,
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