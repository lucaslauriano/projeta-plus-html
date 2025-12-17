'use client';

import React from 'react';
import { RoomAnnotation } from '@/app/dashboard/annotation/components/room';
import AnnotationSection from '@/app/dashboard/annotation/components/sections';
import PageHeader from '@/components/page-header';
import { Zap, LampCeiling } from 'lucide-react';
import { AiOutlineScan } from 'react-icons/ai';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BsHouse } from 'react-icons/bs';
import PageWrapper from '@/components/ui/page-wraper';
import PageContent from '@/components/ui/page-content';
import AnnotationCeiling from '@/app/dashboard/annotation/components/ceilling';
import AnnotationLighting from '@/app/dashboard/annotation/components/lighting';
import { ElectricalChangeAtributes } from '@/app/dashboard/annotation/components/change-atributes';

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
    label: 'Cortes e Vistas',
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
    label: 'Eletrica',
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
        <Accordion type='single' collapsible className='w-full space-y-4'>
          {accordionItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <AccordionItem
                key={item.value}
                value={item.value}
                className='border bg-card rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow'
              >
                <AccordionTrigger className='px-3 hover:no-underline'>
                  <div className='flex items-center gap-3 text-base font-semibold '>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 '>
                      <IconComponent className='w-5 h-5 text-primary' />
                    </div>
                    <span>{item.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='px-5 pb-4'>
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
