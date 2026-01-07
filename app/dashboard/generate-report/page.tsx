'use client';

import PageHeader from '@/components/page-header';
import PageWrapper from '@/components/ui/page-wraper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Armchair, Zap, Lightbulb, Box, Layers } from 'lucide-react';
import ElectricalReport from './components/electrical';
import BaseboardsReport from './components/baseboards';
import CoatingsReport from '@/app/dashboard/generate-report/components/coatings';
import LightningReport from '@/app/dashboard/generate-report/components/lightning';
import { FurnitureReports } from '@/app/dashboard/generate-report/components/forniture';
import PageContent from '@/components/ui/page-content';

const REPORT_TABS = [
  {
    value: 'furniture',
    icon: Armchair,
    tooltip: 'Relatório de Mobiliário',
  },
  {
    value: 'electrical',
    icon: Zap,
    tooltip: 'Relatório Elétrico',
  },
  {
    value: 'lightning',
    icon: Lightbulb,
    tooltip: 'Relatório de Iluminação',
  },
  {
    value: 'baseboards',
    icon: Box,
    tooltip: 'Relatório de Rodapés',
  },
  {
    value: 'coatings',
    icon: Layers,
    tooltip: 'Relatório de Revestimentos',
  },
] as const;

export default function GenerateReportDashboardPage() {
  return (
    <PageWrapper>
      <PageHeader
        title='Relatórios'
        description='Gere relatórios detalhados do seu projeto'
      />
      <PageContent>
        <Tabs defaultValue='furniture' className='w-full'>
          <TooltipProvider delayDuration={300}>
            <TabsList className='grid w-full grid-cols-5'>
              {REPORT_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className='flex items-center gap-2'
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='flex items-center gap-2'>
                          <Icon className='w-4 h-4' />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tab.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </TooltipProvider>

          <TabsContent value='furniture' className='mt-4'>
            <FurnitureReports />
          </TabsContent>

          <TabsContent value='electrical' className='mt-4'>
            <ElectricalReport />
          </TabsContent>

          <TabsContent value='lightning' className='mt-4'>
            <LightningReport />
          </TabsContent>

          <TabsContent value='baseboards' className='mt-4'>
            <BaseboardsReport />
          </TabsContent>

          <TabsContent value='coatings' className='mt-4'>
            <CoatingsReport />
          </TabsContent>
        </Tabs>
      </PageContent>
    </PageWrapper>
  );
}
