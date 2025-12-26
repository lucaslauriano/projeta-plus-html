'use client';

import React, { useState, useEffect } from 'react';
import { Grid3x3, Trash2, Folder, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlanItem } from '@/components/PlanItem';
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
import { SectionsConfigDialog } from '@/app/dashboard/inteli-sket/components/sections-config-dialog';
import { SegmentEditDialog } from '@/app/dashboard/inteli-sket/components/segment-edit-dialog';
import { SelectScenesDialog } from '@/app/dashboard/inteli-sket/components/select-scenes-dialog';
import { Segment } from 'next/dist/server/app-render/types';

export default function SectionsComponent() {
  const {
    data,
    isBusy,
    isAvailable,
    createStandardSections,
    createAutoViews,
    createIndividualSection,
    saveToJson,
    loadFromJson,
    loadDefault,
    loadFromFile,
    settings,
    availableStyles,
    availableLayers,
    modelScenes,
    saveSectionsSettings,
    applyCurrentStyleToSections,
    getCurrentActiveLayers,
    getCurrentActiveLayersFiltered,
    addGroup,
    updateGroup,
    deleteGroup,
    addSegment,
    updateSegment,
    deleteSegment,
    duplicateScenesWithSegment,
    getModelScenes,
  } = useSections();

  const [isIndividualDialogOpen, setIsIndividualDialogOpen] = useState(false);
  const [individualSectionName, setIndividualSectionName] = useState('');
  const [individualSectionDirection, setIndividualSectionDirection] =
    useState('frente');

  const [isAutoViewsDialogOpen, setIsAutoViewsDialogOpen] = useState(false);
  const [autoViewsEnvironmentName, setAutoViewsEnvironmentName] = useState('');

  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [configStyle, setConfigStyle] = useState(settings.style);
  const [configLayers, setConfigLayers] = useState(settings.activeLayers);

  const [isSegmentEditDialogOpen, setIsSegmentEditDialogOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<{
    groupId: string;
    segment?: {
      id: string;
      name: string;
      code: string;
      style: string;
      activeLayers: string[];
    };
  } | null>(null);
  const [segmentName, setSegmentName] = useState('');
  const [segmentCode, setSegmentCode] = useState('');
  const [segmentStyle, setSegmentStyle] = useState('FM_VISTAS');
  const [segmentLayers, setSegmentLayers] = useState<string[]>([]);

  const [isSelectScenesDialogOpen, setIsSelectScenesDialogOpen] =
    useState(false);
  const [selectedScenes, setSelectedScenes] = useState<string[]>([]);
  const [duplicatingSegment, setDuplicatingSegment] = useState<{
    groupId: string;
    segment: {
      id: string;
      name: string;
      code: string;
      style: string;
      activeLayers: string[];
    };
  } | null>(null);

  useEffect(() => {
    setConfigStyle(settings.style);
    setConfigLayers(settings.activeLayers);
  }, [settings]);

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

  const handleSaveConfig = () => {
    saveSectionsSettings({
      style: configStyle,
      activeLayers: configLayers,
    });
    setIsConfigDialogOpen(false);
  };

  const handleApplyCurrentState = (availableLayers: string[]) => {
    applyCurrentStyleToSections();
    getCurrentActiveLayersFiltered(availableLayers, (layers) => {
      setConfigLayers(layers);
    });
  };

  const handleOpenConfig = () => {
    setConfigStyle(settings.style);
    setConfigLayers(settings.activeLayers);
    setIsConfigDialogOpen(true);
  };

  const handleAddSegment = (groupId: string) => {
    setEditingSegment({ groupId });
    setSegmentName('');
    setSegmentCode('');
    setSegmentStyle('FM_VISTAS');
    setSegmentLayers([]);
    setIsSegmentEditDialogOpen(true);
  };

  const handleEditSegment = (groupId: string, segment: Segment) => {
    setEditingSegment({ groupId, segment });
    setSegmentName(segment.name);
    setSegmentCode(segment.code);
    setSegmentStyle(segment.style);
    setSegmentLayers(segment.activeLayers || []);
    setIsSegmentEditDialogOpen(true);
  };

  const handleSaveSegment = () => {
    if (!editingSegment) return;

    const params = {
      name: segmentName,
      code: segmentCode,
      style: segmentStyle,
      activeLayers: segmentLayers,
    };

    if (editingSegment.segment) {
      updateSegment(editingSegment.groupId, editingSegment.segment.id, params);
    } else {
      addSegment(editingSegment.groupId, params);
    }

    setIsSegmentEditDialogOpen(false);
    setEditingSegment(null);
  };

  const handleDeleteSegment = (groupId: string, segmentId: string) => {
    if (confirm('Deseja realmente remover este segmento?')) {
      deleteSegment(groupId, segmentId);
    }
  };

  const handleApplySegmentCurrentState = (availableLayers: string[]) => {
    applyCurrentStyleToSections();
    getCurrentActiveLayersFiltered(availableLayers, (layers) => {
      setSegmentLayers(layers);
    });
  };

  const handleOpenDuplicateDialog = async (
    groupId: string,
    segment: Segment
  ) => {
    setDuplicatingSegment({ groupId, segment });
    setSelectedScenes([]);
    setIsSelectScenesDialogOpen(true);

    await getModelScenes();
  };

  const handleConfirmDuplication = () => {
    if (!duplicatingSegment || selectedScenes.length === 0) return;

    duplicateScenesWithSegment({
      sceneNames: selectedScenes,
      code: duplicatingSegment.segment.code,
      style: duplicatingSegment.segment.style,
      activeLayers: duplicatingSegment.segment.activeLayers || [],
    });

    setIsSelectScenesDialogOpen(false);
    setDuplicatingSegment(null);
    setSelectedScenes([]);
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
          onEdit={handleOpenConfig}
          onSaveToJson={saveToJson}
          onLoadDefault={loadDefault}
          onLoadFromJson={loadFromJson}
          onLoadFromFile={loadFromFile}
        />
      </div>

      <SectionsConfigDialog
        isOpen={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
        availableStyles={availableStyles}
        availableLayers={availableLayers}
        style={configStyle}
        activeLayers={configLayers}
        onStyleChange={setConfigStyle}
        onLayersChange={setConfigLayers}
        onApplyCurrentState={handleApplyCurrentState}
        onSave={handleSaveConfig}
        isBusy={isBusy}
      />

      <SegmentEditDialog
        isOpen={isSegmentEditDialogOpen}
        onOpenChange={setIsSegmentEditDialogOpen}
        availableStyles={availableStyles}
        availableLayers={availableLayers}
        name={segmentName}
        code={segmentCode}
        style={segmentStyle}
        activeLayers={segmentLayers}
        onNameChange={setSegmentName}
        onCodeChange={setSegmentCode}
        onStyleChange={setSegmentStyle}
        onLayersChange={setSegmentLayers}
        onApplyCurrentState={handleApplySegmentCurrentState}
        onSave={handleSaveSegment}
        isBusy={isBusy}
        isNew={!editingSegment?.segment}
      />

      <SelectScenesDialog
        isOpen={isSelectScenesDialogOpen}
        onOpenChange={setIsSelectScenesDialogOpen}
        availableScenes={modelScenes}
        selectedScenes={selectedScenes}
        onSelectedScenesChange={setSelectedScenes}
        onConfirm={handleConfirmDuplication}
        isBusy={isBusy}
      />

      <div className='flex flex-col gap-2 w-full'>
        <Button
          size='sm'
          variant='default'
          onClick={createStandardSections}
          disabled={isBusy}
        >
          <Grid3x3 className='w-5 h-5' />
          Cortes Gerais (ABCD)
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
          {data.groups.map((group) => (
            <AccordionItem
              key={group.id}
              value={group.id}
              className='border rounded-xl overflow-hidden bg-muted/20 px-0'
            >
              <div className='relative group'>
                <AccordionTrigger className='px-4 py-2 hover:no-underline bg-muted/50 data-[state=open]:bg-muted/70 data-[state=open]:rounded-bl-none data-[state=open]:rounded-br-none w-full'>
                  <div className='flex items-center gap-2 font-medium text-sm'>
                    <Folder className='w-4 h-4 text-muted-foreground' />
                    {group.name || 'Grupo'}
                  </div>
                </AccordionTrigger>
                <div className='absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground pointer-events-none z-10'>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSegment(group.id);
                    }}
                    className='opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto hover:text-foreground'
                    title='Adicionar segmento'
                    role='button'
                    tabIndex={0}
                  >
                    <Plus className='w-4 h-4' />
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className='opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto hover:text-foreground'
                    title='Editar grupo'
                    role='button'
                    tabIndex={0}
                  >
                    <Edit className='w-4 h-4' />
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Deseja realmente remover este grupo?')) {
                        deleteGroup(group.id);
                      }
                    }}
                    className='opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto hover:text-destructive'
                    title='Excluir grupo'
                    role='button'
                    tabIndex={0}
                  >
                    <Trash2 className='w-4 h-4' />
                  </span>
                </div>
              </div>
              <AccordionContent className='p-4'>
                <div className='space-y-3'>
                  {(group.segments || []).length > 0 ? (
                    <div className='space-y-2'>
                      {(group.segments || []).map((segment) => (
                        <PlanItem
                          key={segment.id}
                          title={segment.name}
                          onEdit={() => handleEditSegment(group.id, segment)}
                          onLoadFromJson={() =>
                            handleOpenDuplicateDialog(group.id, segment)
                          }
                          onDuplicate={() =>
                            handleOpenDuplicateDialog(group.id, segment)
                          }
                          onDelete={() =>
                            handleDeleteSegment(group.id, segment.id)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-4 text-sm text-muted-foreground italic'>
                      Nenhum segmento neste grupo
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
