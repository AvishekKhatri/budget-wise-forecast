
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';

// This hook provides compatibility with libraries expecting next-themes
export function useTheme() {
  const { theme, setTheme } = useThemeContext();
  
  return {
    theme,
    setTheme,
    systemTheme: 'light', // Default system theme
    themes: ['light', 'dark']
  };
}
