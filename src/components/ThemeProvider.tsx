import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  theme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  actualTheme?: Exclude<Theme, 'system'>;
};

const initialState: ThemeProviderState = {
  theme: 'system',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  theme = 'light',
  ...props
}: ThemeProviderProps) {
  const [actualTheme, setActualTheme] = useState<Exclude<Theme, 'system'>>();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      setActualTheme(systemTheme);

      return;
    }

    setActualTheme(theme);
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    actualTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
