import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'aiva-theme';
const DEFAULT_THEME = 'midnight';
const VALID = ['midnight', 'orchard'];

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  toggleTheme: () => {},
});

function readInitialTheme() {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    // Prefer whatever the FOUC-prevention script already applied to <html>.
    const applied = document.documentElement.getAttribute('data-theme');
    if (VALID.includes(applied)) return applied;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (VALID.includes(stored)) return stored;
  } catch {
    /* localStorage may be unavailable */
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readInitialTheme);

  const applyTheme = useCallback((next) => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  // Sync on mount (covers SSG hydration where state initialised to default).
  useEffect(() => {
    const initial = readInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback(
    (next) => {
      if (!VALID.includes(next)) return;
      setThemeState(next);
      applyTheme(next);
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'orchard' ? 'midnight' : 'orchard');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
