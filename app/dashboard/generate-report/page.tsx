'use client';

import PageHeader from '@/components/page-header';

export default function GenerateReportDashboardPage() {
  return (
    <div className='flex flex-col w-full max-w-2xl mx-auto px-2'>
      <PageHeader
        title='Relatórios'
        description='Gere relatórios detalhados do seu projeto'
      />
    </div>
  );
}
