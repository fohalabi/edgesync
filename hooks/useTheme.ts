'use client';

import { useEffect, useState } from 'react';

const THEME_KEY = 'edgesync-theme';

function preferredDarkMode() {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  } catch {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  }
}

export function useTheme() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    setDarkMode(preferredDarkMode());

    const syncTheme = (event: StorageEvent) => {
      if (event.key === THEME_KEY && (event.newValue === 'dark' || event.newValue === 'light')) {
        setDarkMode(event.newValue === 'dark');
      }
    };
    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  function toggleTheme() {
    const next = !darkMode;
    setDarkMode(next);
    try {
      window.localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch {
      // The theme still works for this page when browser storage is unavailable.
    }
  }

  return { darkMode, toggleTheme };
}
