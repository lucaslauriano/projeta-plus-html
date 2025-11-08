'use client';

import PageHeader from '@/components/page-header';

export default function InteliLayoutDashboardPage() {
  return (
    <div className='flex flex-col w-full max-w-2xl mx-auto px-2'>
      <PageHeader
        title='Layout Inteligente'
        description='Otimize automaticamente o layout do projeto'
      />
    </div>
  );
}
