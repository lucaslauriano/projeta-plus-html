'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

type ContrastLevel = 'default' | 'medium' | 'high';

type ContrastContextType = {
  contrast: ContrastLevel;
  setContrast: (contrast: ContrastLevel) => void;
};

const ContrastContext = createContext<ContrastContextType | undefined>(
  undefined
);

export function ContrastProvider({ children }: { children: React.ReactNode }) {
  const [contrast, setContrastState] = useState<ContrastLevel>('default');
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved contrast from localStorage
    const savedContrast = localStorage.getItem(
      'projeta-plus-contrast'
    ) as ContrastLevel;
    if (savedContrast) {
      setContrastState(savedContrast);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Update the HTML class based on theme and contrast
    const html = document.documentElement;

    // Remove all theme classes
    html.classList.remove(
      'light',
      'light-medium-contrast',
      'light-high-contrast',
      'dark',
      'dark-medium-contrast',
      'dark-high-contrast'
    );

    // Determine the class to add
    let themeClass = theme === 'dark' ? 'dark' : 'light';

    if (contrast === 'medium') {
      themeClass += '-medium-contrast';
    } else if (contrast === 'high') {
      themeClass += '-high-contrast';
    }

    html.classList.add(themeClass);
  }, [theme, contrast, mounted]);

  const setContrast = (newContrast: ContrastLevel) => {
    setContrastState(newContrast);
    localStorage.setItem('projeta-plus-contrast', newContrast);
  };

  return (
    <ContrastContext.Provider value={{ contrast, setContrast }}>
      {children}
    </ContrastContext.Provider>
  );
}

export function useContrast() {
  const context = useContext(ContrastContext);
  if (context === undefined) {
    throw new Error('useContrast must be used within a ContrastProvider');
  }
  return context;
}
