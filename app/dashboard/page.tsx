'use client';

import { useUser } from '@clerk/nextjs';
import { VideoCarousel } from '@/components/video-carousel';
import { PricingSection } from '@/components/pricing-section';
import { PackageIcon, FileTextIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type TabId = 'tutoriais' | 'precos';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<TabId>('tutoriais');

  const hasPremiumPlan =
    user?.publicMetadata?.plan === 'premium' ||
    user?.publicMetadata?.plan === 'pro_user';
  const userPlan: 'free' | 'premium' = hasPremiumPlan ? 'premium' : 'free';

  const tabs = [
    { id: 'tutoriais' as TabId, name: 'Tutoriais', icon: FileTextIcon },
    { id: 'precos' as TabId, name: 'Planos e Preços', icon: PackageIcon },
  ];

  if (!isLoaded) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-muted-foreground'>Carregando...</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full max-w-4xl mx-auto px-4'>
      <div className='mb-8 pt-2'>
        <h1 className='text-2xl font-bold font-sans tracking-tight'>
          Dashboard
        </h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Bem-vindo de volta, {user?.firstName}
        </p>
      </div>

      <div className='mb-6'>
        <nav
          aria-label='Tabs'
          className='flex gap-2 p-1 bg-muted/50 rounded-2xl'
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <TabIcon className='w-4 h-4' />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className='pb-8'>
        {activeTab === 'tutoriais' && (
          <VideoCarousel
            useChannel={true}
            channelId='@francielimadeira'
            maxVideos={5}
            title='Últimos Tutoriais'
            description='Aprenda a usar todas as funcionalidades'
          />
        )}

        {activeTab === 'precos' && <PricingSection userPlan={userPlan} />}
      </div>
    </div>
  );
}
