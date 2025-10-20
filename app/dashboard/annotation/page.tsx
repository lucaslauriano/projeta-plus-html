'use client';

import React from 'react';
import { RoomAnnotation } from '@/app/dashboard/annotation/components/room';
import AnnotationSection from '@/app/dashboard/annotation/components/sections';
import PageHeader from '@/components/page-header';
import { Zap, Frame, LampCeiling } from 'lucide-react';
import { AiOutlineScan, AiOutlineTag } from 'react-icons/ai';
import AnnotationLightingCeiling from '@/app/dashboard/annotation/components/ceilling';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion_';

const accordionItems = [
  {
    value: 'room',
    label: 'Ambiente',
    icon: AiOutlineTag,
    content: <RoomAnnotation />,
  },
  {
    value: 'section',
    label: 'Cortes e Vistas',
    icon: AiOutlineScan,
    content: <AnnotationSection />,
  },
  {
    value: 'ceiling',
    label: 'Iluminação e Forro',
    icon: LampCeiling,
    content: <AnnotationLightingCeiling />,
  },
  {
    value: 'electrical',
    label: 'Eletrica',
    icon: Zap,
    content: <div>Electrical content coming soon...</div>,
  },
  {
    value: 'frames',
    label: 'Esquadrias',
    icon: Frame,
    content: <div>Frames content coming soon...</div>,
  },
];

export default function AnnotationDashboardPage() {
  return (
    <div className='flex flex-col w-full  justify-start items-start'>
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

      <div className='w-full'>
        <Accordion type='multiple' className='w-full'>
          {accordionItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className='flex items-start gap-2'>
                  <IconComponent className='w-5 h-5' />
                  {item.label}
                </AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
