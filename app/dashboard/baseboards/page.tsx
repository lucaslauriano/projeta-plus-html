'use client';

import PageHeader from '@/components/page-header';

export default function BaseboardsDashboardPage() {
  return (
    <div className='flex flex-col w-full max-w-2xl mx-auto px-2'>
      <PageHeader
        title='Rodapés'
        description='Configure e gerencie rodapés do projeto'
      />
    </div>
  );
}
