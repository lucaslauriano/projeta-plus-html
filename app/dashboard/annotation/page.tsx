'use client';

import RoomAnnotation from '@/app/dashboard/annotation/components/room';
import AnnotationSection from '@/app/dashboard/annotation/components/sections';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionHeader,
  AccordionTrigger,
} from '@radix-ui/react-accordion';

export default function AnnotationDashboardPage() {
  return (
    <div className='flex flex-col w-full gap-4 justify-center items-center'>
      <div className='max-w-4xl w-full bg-red-300'>
        <Accordion type='single' collapsible>
          <AccordionItem value='room-annotation'>
            <AccordionHeader>
              <AccordionTrigger>Room Annotation</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <RoomAnnotation />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='annotation-section'>
            <AccordionHeader>
              <AccordionTrigger>Annotation Section</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <AnnotationSection />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
