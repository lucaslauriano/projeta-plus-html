'use client';

import { useState } from 'react';
import {
  Layers,
  ScanLine,
  BoxesIcon,
  FileSearch,
  LayoutDashboard,
} from 'lucide-react';
import PageHeader from '@/components/page-header';
import PageWrapper from '@/components/ui/page-wraper';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import DetailsComponent from './(modules)/details';
import LayersComponent from './(modules)/layers';
import SectionsComponent from './(modules)/sections';
import PlansComponent from './(modules)/plans';
import ScenesComponent from './(modules)/scenes';
import PageContent from '@/components/ui/page-content';
import Tabs2 from '@/components/ui/tabs2';

export default function InteliSketDashboardPage() {
  const [activeTab, setActiveTab] = useState('layers');

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsComponent />;
      case 'layers':
        return <LayersComponent />;
      case 'scenes':
        return <ScenesComponent />;
      case 'plans':
        return <PlansComponent />;
      case 'sections':
        return <SectionsComponent />;
      default:
        return <DetailsComponent />;
    }
  };

  const tabs = [
    { id: 'layers', label: 'Camadas', icon: Layers },
    { id: 'scenes', label: 'Cenas', icon: BoxesIcon },
    { id: 'plans', label: 'Plantas', icon: LayoutDashboard },
    { id: 'sections', label: 'Seções', icon: ScanLine },
    { id: 'details', label: 'Detalhes', icon: FileSearch },
  ];

  return (
    <PageWrapper>
      <PageHeader
        title='Sketchup Inteligente'
        description='Organize suas camadas, seções e plantas, detalhes e mais.'
      />

      <PageContent>
        <div className='flex space-x-2 border-b mb-4 items-center'>
          {/* 
          <TooltipProvider>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Tooltip key={tab.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={`p-2 rounded-md transition-colors flex-1 flex justify-center items-center ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className='w-5 h-5' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tab.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider> 
          */}
          <TooltipProvider>
            <Tabs2
              tabs={tabs.map((tab) => ({
                name: tab.label,
                href: '#',
                current: activeTab === tab.id,
                icon: tab.icon,
                id: tab.id,
              }))}
              onTabChange={setActiveTab}
            />
          </TooltipProvider>
        </div>

        <div className='mt-4'>{renderContent()}</div>
      </PageContent>
    </PageWrapper>
  );
}
