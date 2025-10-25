import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

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
