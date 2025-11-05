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
    <div className='space-y-4'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold font-sans'>Dashboard</h1>
        <p className='text-muted-foreground font-serif flex items-center gap-1'>
          Bem-vindo ao
          <span className='font-sans font-bold inline-flex items-center'>
            Projeta
            <Plus className='h-3 w-3 text-secondary' />
          </span>
          , {user?.firstName}.
        </p>
      </div>

      <div className='border-b border-border'>
        <nav aria-label='Tabs' className=' -mb-px flex space-x-8'>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  isActive
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300',
                  'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors'
                )}
              >
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className='mt-4'>
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
