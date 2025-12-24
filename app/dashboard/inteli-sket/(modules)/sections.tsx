'use client';

import React, { useState } from 'react';
import { Grid3x3, Trash2, Folder, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSections } from '@/hooks/useSections';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { CreateAutoViewsDialog } from '@/app/dashboard/inteli-sket/components/create-auto-views-dialog';
import { CreateIndividualSectionDialog } from '@/app/dashboard/inteli-sket/components/create-individual-section-dialog';

export default function SectionsComponent() {
  const {
    data,
    isBusy,
    isAvailable,
    createStandardSections,
    createAutoViews,
    createIndividualSection,
    // getSections,
    // deleteSection,
    // importToModel,
    // clearAll,
    saveToJson,
    loadFromJson,
    loadDefault,
    loadFromFile,
  } = useSections();

  console.log('data', data);

  const [isIndividualDialogOpen, setIsIndividualDialogOpen] = useState(false);
  const [individualSectionName, setIndividualSectionName] = useState('');
  const [individualSectionDirection, setIndividualSectionDirection] =
    useState('frente');

  const [isAutoViewsDialogOpen, setIsAutoViewsDialogOpen] = useState(false);
  const [autoViewsEnvironmentName, setAutoViewsEnvironmentName] = useState('');

  const handleCreateIndividualSection = () => {
    if (!individualSectionName.trim()) {
      return;
    }

    createIndividualSection(individualSectionDirection, individualSectionName);
    setIsIndividualDialogOpen(false);
    setIndividualSectionName('');
    setIndividualSectionDirection('frente');
  };

  const handleCreateAutoViews = () => {
    if (!autoViewsEnvironmentName.trim()) {
      return;
    }

    createAutoViews(autoViewsEnvironmentName);
    setIsAutoViewsDialogOpen(false);
    setAutoViewsEnvironmentName('');
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-semibold'>Seções</h2>
          {!isAvailable && (
            <Badge variant='outline' className='text-xs'>
              Modo Simulação
            </Badge>
          )}
        </div>
        <ViewConfigMenu
          isBusy={isBusy}
          entityLabel='Seção'
          onEdit={() => {}}
          onSaveToJson={saveToJson}
          onLoadDefault={loadDefault}
          onLoadFromJson={loadFromJson}
          onLoadFromFile={loadFromFile}
        />
      </div>
      <div className='flex flex-col gap-2 w-full'>
        <Button
          size='sm'
          variant='default'
          onClick={createStandardSections}
          disabled={isBusy}
        >
          <Grid3x3 className='w-5 h-5' />
          Cortes Gerais (A, B, C, D)
        </Button>

        <CreateAutoViewsDialog
          open={isAutoViewsDialogOpen}
          disabled={isBusy}
          environmentName={autoViewsEnvironmentName}
          onConfirm={handleCreateAutoViews}
          onOpenChange={setIsAutoViewsDialogOpen}
          onEnvironmentNameChange={setAutoViewsEnvironmentName}
        />

        <CreateIndividualSectionDialog
          open={isIndividualDialogOpen}
          disabled={isBusy}
          direction={individualSectionDirection}
          sectionName={individualSectionName}
          onConfirm={handleCreateIndividualSection}
          onOpenChange={setIsIndividualDialogOpen}
          onSectionNameChange={setIndividualSectionName}
          onDirectionChange={setIndividualSectionDirection}
        />
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <Accordion type='single' collapsible className='w-full space-y-2'>
          {data?.sections.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className='border rounded-xl overflow-hidden bg-muted/20 px-0'
            >
              <AccordionTrigger className='px-4 py-2 hover:no-underline bg-muted/50 data-[state=open]:bg-muted/70 group data-[state=open]:rounded-bl-none data-[state=open]:rounded-br-none'>
                <div className='flex items-center justify-between w-full pr-2'>
                  <div className='flex items-center gap-2 font-medium text-sm'>
                    <Folder className='w-4 h-4 text-muted-foreground' />
                    {item?.name || 'Seção'}
                  </div>
                  <div className='flex  items-center justify-end gap-2 text-muted-foreground'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className='opacity-0 group-hover:opacity-100 transition-opacity'
                      title='Editar'
                    >
                      <Edit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className='opacity-0 group-hover:opacity-100 transition-opacity'
                      title='Excluir pasta'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className='p-4'>
                <div className='space-y-3 bg-blue-500'>
                  {/* {item.plans.length > 0 ? (
                    <div className='space-y-2'>
                      {item.plans.map((plan) => (
                        <PlanItem
                          key={plan.id}
                          title={plan.title}
                          onEdit={() => {}}
                          onLoadFromJson={() => {}}
                          onDuplicate={() => {}}
                          onDelete={() => {}}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-4 text-sm text-muted-foreground italic'>
                      Nenhuma planta neste grupo
                    </div>
                  )} */}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
