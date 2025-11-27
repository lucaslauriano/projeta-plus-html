'use client';

import { useState } from 'react';
import { Info, Layers, ScanLine, Map } from 'lucide-react';
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

export default function InteliSketDashboardPage() {
  const [activeTab, setActiveTab] = useState('layers');

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsComponent />;
      case 'layers':
        return <LayersComponent />;
      case 'sections':
        return <SectionsComponent />;
      case 'plans':
        return <PlansComponent />;
      default:
        return <DetailsComponent />;
    }
  };

  const tabs = [
    { id: 'layers', label: 'Camadas', icon: Layers },
    { id: 'sections', label: 'Seções', icon: ScanLine },
    { id: 'plans', label: 'Plantas', icon: Map },
    { id: 'details', label: 'Detalhes', icon: Info },
  ];

  return (
    <PageWrapper>
      <PageHeader
        title='Sketchup Inteligente'
        description='Ferramentas inteligentes para otimizar seu fluxo de trabalho'
      />

      <div className='mt-4'>
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
      </div>
    </PageWrapper>
  );
}
