'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme && typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
    }
  };

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>Tema</label>
      <div className='flex items-start w-full justify-between gap-2'>
        <Button
          variant={theme === 'light' ? 'default' : 'outline'}
          size='sm'
          onClick={() => handleThemeChange('light')}
          className='flex-1'
        >
          <Sun className='h-4 w-4 mr-2' />
          Claro
        </Button>
        <Button
          variant={theme === 'dark' ? 'default' : 'outline'}
          size='sm'
          onClick={() => handleThemeChange('dark')}
          className='flex-1'
        >
          <Moon className='h-4 w-4 mr-2' />
          Escuro
        </Button>
      </div>
    </div>
  );
}

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={toggleTheme}
      className='hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
    >
      {theme === 'dark' ? (
        <Sun className='h-5 w-5' />
      ) : (
        <Moon className='h-5 w-5' />
      )}
    </Button>
  );
}
