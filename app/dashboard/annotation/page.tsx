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
import { BsHouse } from 'react-icons/bs';

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
    label: 'Forro e Iluminação',
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
    <div className='flex flex-col w-full max-w-2xl mx-auto'>
      <PageHeader
        title='Anotações'
        description='Gerencie suas anotações do projeto'
      />

      <div className='w-full pb-8'>
        <Accordion type='multiple' className='w-full space-y-4'>
          {accordionItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <AccordionItem
                key={item.value}
                value={item.value}
                className='border-0 bg-card rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow'
              >
                <AccordionTrigger className='px-5 py-5 hover:no-underline'>
                  <div className='flex items-center gap-3 text-base font-semibold'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'>
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
      </div>
    </div>
  );
}
