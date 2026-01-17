'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 150, height = 40 }: LogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evita flash durante hidratação
  if (!mounted) {
    return (
      <div
        className={className}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const logoSrc = currentTheme === 'dark' ? '/logo_dark.png' : '/logo_light.png';

  return (
    <Image
      src={logoSrc}
      alt='Projeta Plus Logo'
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
