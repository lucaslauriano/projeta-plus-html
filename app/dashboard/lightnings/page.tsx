'use client';

import PageHeader from '@/components/page-header';

export default function LightningsDashboardPage() {
  return (
    <div className='flex flex-col w-full max-w-2xl mx-auto px-2'>
      <PageHeader
        title='Iluminação'
        description='Configure pontos de iluminação e circuitos'
      />
    </div>
  );
}
