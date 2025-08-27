'use client';

import { usePathname } from 'next/navigation';

export default function FurnitureDashboardPage() {
  const pathname = usePathname();
  const slug = pathname?.split('/').filter(Boolean).pop();
  return <div>Dashboard Page - {slug}</div>;
}
