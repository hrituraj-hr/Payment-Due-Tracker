import { createContext, useContext, useEffect, useState } from 'react';
import { getThemeMode, setThemeMode } from '@/utils/storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  colors: {
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
    secondary: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    getThemeMode().then(setTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setThemeMode(newTheme);
  };

  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#1a1a1a' : '#f8fafc',
    text: isDark ? '#ffffff' : '#1e293b',
    card: isDark ? '#2d2d2d' : '#ffffff',
    border: isDark ? '#404040' : '#e5e5e5',
    primary: '#6366f1',
    secondary: isDark ? '#818cf8' : '#e0e7ff',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}