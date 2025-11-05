'use client';

import { useTheme } from 'next-themes';
import { useContrast } from '@/contexts/ContrastContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { contrast, setContrast } = useContrast();

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Aparência</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Theme Mode Selection */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Tema</label>
          <div className='flex gap-2'>
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setTheme('light')}
              className='flex-1'
            >
              <Sun className='h-4 w-4 mr-2' />
              Claro
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setTheme('dark')}
              className='flex-1'
            >
              <Moon className='h-4 w-4 mr-2' />
              Escuro
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setTheme('system')}
              className='flex-1'
            >
              <Monitor className='h-4 w-4 mr-2' />
              Auto
            </Button>
          </div>
        </div>

        {/* Contrast Level Selection */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Contraste</label>
          <Select
            value={contrast}
            onValueChange={(value) =>
              setContrast(value as 'default' | 'medium' | 'high')
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='default'>Padrão</SelectItem>
              <SelectItem value='medium'>Médio</SelectItem>
              <SelectItem value='high'>Alto</SelectItem>
            </SelectContent>
          </Select>
          <p className='text-xs text-muted-foreground'>
            Ajuste o nível de contraste para melhor legibilidade
          </p>
        </div>
      </CardContent>
    </Card>
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
