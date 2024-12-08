import { useState, useEffect } from 'react';
import { themes, ThemeMode, ThemeColors } from '@/styles/themes';

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme) {
      setMode(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = mode === 'light' ? 'dark' : 'light';
    setMode(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return {
    theme: themes[mode],
    mode,
    toggleTheme
  };
};