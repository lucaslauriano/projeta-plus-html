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
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ElectricalChangeAtributes } from '@/app/dashboard/annotation/components/change-atributes';

const accordionItems = [
  {
    icon: AiOutlineTag,
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
    label: 'Iluminação e Forro',
    content: <AnnotationLightingCeiling />,
  },
  {
    icon: Zap,
    value: 'electrical',
    label: 'Eletrica',
    content: <ElectricalChangeAtributes />,
  },
  {
    icon: Frame,
    value: 'frames',
    label: 'Esquadrias',
    content: <div>Frames content coming soon...</div>,
  },
];

export default function AnnotationDashboardPage() {
  return (
    <div className='flex flex-col w-full justify-start items-start'>
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
                <AccordionTrigger className='flex gap-2'>
                  <div className='flex items-start justify-start gap-2'>
                    <IconComponent className='w-5 h-5' />
                    {item.label}
                  </div>
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
