'use client';

import { usePathname } from 'next/navigation';

export default function InteliSketDashboardPage() {
  const pathname = usePathname();
  const slug = pathname?.split('/').filter(Boolean).pop();
  return <div className='flex flex-col gap-4 p-4'>Dashboard Page - {slug}</div>;
}
