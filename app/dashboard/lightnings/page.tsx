'use client';

import PageHeader from '@/components/page-header';
import PageWrapper from '@/components/ui/page-wraper';

export default function LightningsDashboardPage() {
  return (
    <PageWrapper>
      <PageHeader
        title='Iluminação'
        description='Configure pontos de iluminação e circuitos'
      />
    </PageWrapper>
  );
}
