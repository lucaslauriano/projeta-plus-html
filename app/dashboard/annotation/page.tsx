'use client';

import React, { useState } from 'react';
import { RoomAnnotation } from '@/app/dashboard/annotation/components/room';
import AnnotationSection from '@/app/dashboard/annotation/components/sections';
import PageHeader from '@/components/page-header';
import { cn } from '@/lib/utils';
import { Zap, Frame, LampCeiling } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AiOutlineScan, AiOutlineTag } from 'react-icons/ai';
import AnnotationLightingCeiling from '@/app/dashboard/annotation/components/ceilling';

enum AnnotationTab {
  ROOM = 'room',
  SECTION = 'section',
  CEILING = 'ceiling',
  ELETRICAL = 'eletrical',
  FRAMES = 'frames',
}

const tabsConfig = [
  {
    id: AnnotationTab.ROOM,
    label: 'Ambiente',
    icon: AiOutlineTag,
  },
  {
    id: AnnotationTab.SECTION,
    label: 'Cortes e Vistas',
    icon: AiOutlineScan,
  },
  {
    id: AnnotationTab.CEILING,
    label: 'Iluminação e Forro',
    icon: LampCeiling,
  },
  {
    id: AnnotationTab.ELETRICAL,
    label: 'Eletrica',
    icon: Zap,
  },
  {
    id: AnnotationTab.FRAMES,
    label: 'Esquadrias',
    icon: Frame,
  },
];

export default function AnnotationDashboardPage() {
  const [activeTab, setActiveTab] = useState<AnnotationTab>(AnnotationTab.ROOM);

  return (
    <TooltipProvider>
      <div className='flex flex-col w-full gap-4 justify-start items-start'>
        <PageHeader
          title='Annotation'
          breadcrumbs={[
            {
              name: 'Dashboard',
              href: '/dashboard',
            },
            {
              name: 'Annotation',
              href: '/dashboard/annotation',
            },
          ]}
        />

        <div className='w-full '>
          <div className='flex w-full border-b border-border justify-center items-center '>
            <nav
              aria-label='Content tabs'
              className='-mb-px flex space-x-4 w-full overflow-x-auto no-scrollbar'
            >
              {tabsConfig.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <Tooltip key={tab.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                          'border-b-2 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center'
                        )}
                      >
                        <IconComponent className='w-6 h-6' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tab.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          </div>
          <div className='mt-6'>
            {activeTab === AnnotationTab.ROOM && <RoomAnnotation />}
            {activeTab === AnnotationTab.SECTION && <AnnotationSection />}
            {activeTab === AnnotationTab.CEILING && (
              <AnnotationLightingCeiling />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
