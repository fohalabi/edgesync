'use client';

import { useEffect, useState } from 'react';

export function useTheme() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem('edgesync-theme');
    setDarkMode(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  function toggleTheme() {
    setDarkMode((current) => {
      const next = !current;
      window.localStorage.setItem('edgesync-theme', next ? 'dark' : 'light');
      return next;
    });
  }

  return { darkMode, toggleTheme };
}
