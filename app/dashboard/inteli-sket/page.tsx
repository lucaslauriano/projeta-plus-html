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
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import DetailsComponent from './components/details';
import LayersComponent from './components/layers';
import SectionsComponent from './components/sections';
import PlansComponent from './components/plans';
import ScenesComponent from '@/app/dashboard/inteli-sket/components/scenes';
import PageContent from '@/components/ui/page-content';

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
        <div className='flex space-x-2 border-b mb-4 pb-2'>
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
        </div>

        <div className='mt-4'>{renderContent()}</div>
      </PageContent>
    </PageWrapper>
  );
}
