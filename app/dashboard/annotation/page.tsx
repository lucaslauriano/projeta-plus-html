'use client';

import React from 'react';
import PageHeader from '@/components/page-header';
import { BsHouse } from 'react-icons/bs';
import { AiOutlineScan } from 'react-icons/ai';
import { RoomAnnotation } from '@/app/dashboard/annotation/components/room';
import { Zap, LampCeiling } from 'lucide-react';
import { ElectricalChangeAtributes } from '@/app/dashboard/annotation/components/change-atributes';
import AnnotationSection from '@/app/dashboard/annotation/components/sections';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import PageWrapper from '@/components/ui/page-wraper';
import PageContent from '@/components/ui/page-content';
import AnnotationCeiling from '@/app/dashboard/annotation/components/ceilling';
import AnnotationLighting from '@/app/dashboard/annotation/components/lighting';

const accordionItems = [
  {
    icon: BsHouse,
    value: 'room',
    label: 'Ambiente',
    content: <RoomAnnotation />,
  },
  {
    icon: AiOutlineScan,
    value: 'section',
    label: 'Seções e Vistas',
    content: <AnnotationSection />,
  },
  {
    icon: LampCeiling,
    value: 'ceiling',
    label: 'Forro',
    content: <AnnotationCeiling />,
  },
  {
    icon: LampCeiling,
    value: 'lighting',
    label: 'Iluminação',
    content: <AnnotationLighting />,
  },
  {
    icon: Zap,
    value: 'electrical',
    label: 'Pontos Técnicos',
    content: <ElectricalChangeAtributes />,
  },
];

export default function AnnotationDashboardPage() {
  return (
    <PageWrapper>
      <PageHeader
        title='Anotações'
        description='Gerencie anotações diretamente no modelo 3D.'
      />

      <PageContent>
        <Accordion type='single' collapsible className='w-full space-y-2'>
          {accordionItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <AccordionItem
                key={item.value}
                value={item.value}
                className='border rounded-md overflow-hidden bg-muted/20 px-0'
              >
                <AccordionTrigger className='hover:no-underline bg-muted/50 data-[state=open]:bg-muted/70 data-[state=open]:rounded-bl-none data-[state=open]:rounded-br-none w-full'>
                  <div className='flex items-start text-base font-semibold '>
                    <IconComponent className='w-4 h-4' />
                  </div>
                  <span className='pl-2 text-start w-full'>{item.label}</span>
                </AccordionTrigger>
                <AccordionContent className='px-4 py-4'>
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </PageContent>
    </PageWrapper>
  );
}
