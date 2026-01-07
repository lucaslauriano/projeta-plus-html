'use client';

import React, { useState } from 'react';
import { LayoutGrid, Grid3x3, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDetails } from '@/hooks/useDetails';
import { DuplicateSceneDialog } from '@/app/dashboard/inteli-sket/components/duplicate-scene-dialog';

export default function DetailsComponent() {
  const {
    styles,
    isProcessing,
    createCarpentryDetail,
    createGeneralDetails,
    getStyles,
    duplicateScene,
    togglePerspective,
  } = useDetails();

  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [suffix, setSuffix] = useState('');

  async function handleCreateCarpentryDetail() {
    await createCarpentryDetail();
  }

  async function handleCreateGeneralDetails() {
    await createGeneralDetails();
  }

  async function handleOpenDuplicateDialog() {
    setIsDuplicateDialogOpen(true);
    await getStyles();
  }

  async function handleDuplicateScene() {
    const success = await duplicateScene(selectedStyle, suffix);
    if (success) {
      setIsDuplicateDialogOpen(false);
      setSelectedStyle('');
      setSuffix('');
    }
  }

  async function handleTogglePerspective() {
    await togglePerspective();
  }

  return (
    <>
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              Detalhamento
            </h2>
          </div>
        </div>

        <div className='flex flex-col gap-3 w-full'>
          <Button
            size='sm'
            variant='default'
            onClick={handleCreateCarpentryDetail}
            disabled={isProcessing}
          >
            <LayoutGrid className='w-5 h-5' />
            Detalhamento Marcenaria
          </Button>

          <Button
            size='sm'
            variant='default'
            onClick={handleCreateGeneralDetails}
            disabled={isProcessing}
          >
            <Grid3x3 className='w-5 h-5' />
            Detalhamento Geral
          </Button>

          <Button
            size='sm'
            variant='default'
            onClick={handleOpenDuplicateDialog}
            disabled={isProcessing}
          >
            <Copy className='w-5 h-5' />
            Duplicar Cenas
          </Button>

          <Button
            size='sm'
            variant='default'
            onClick={handleTogglePerspective}
            disabled={isProcessing}
          >
            <RotateCcw className='w-5 h-5' />
            Alternar Vista
          </Button>
        </div>
      </div>

      <DuplicateSceneDialog
        isOpen={isDuplicateDialogOpen}
        onOpenChange={setIsDuplicateDialogOpen}
        styles={styles}
        selectedStyle={selectedStyle}
        onSelectedStyleChange={setSelectedStyle}
        suffix={suffix}
        onSuffixChange={setSuffix}
        onDuplicate={handleDuplicateScene}
        isProcessing={isProcessing}
      />
    </>
  );
}
