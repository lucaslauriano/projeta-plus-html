'use client';

import React, { useState } from 'react';
import { LayoutGrid, Grid3x3, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import { useDetails } from '@/hooks/useDetails';

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

  function handleDialogKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleDuplicateScene();
    }
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

      {/* Dialog para Duplicar Cenas */}
      <Dialog
        open={isDuplicateDialogOpen}
        onOpenChange={setIsDuplicateDialogOpen}
      >
        <DialogContent className='sm:max-w-[425px] flex flex-col gap-4'>
          <DialogHeader>
            <DialogTitle>Duplicar Cena</DialogTitle>
            <DialogDescription>
              Selecione um estilo e adicione um sufixo para duplicar a cena
              atual.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold mb-2 text-foreground'>
                Estilo
              </label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className='h-11 rounded-xl border-2'>
                  <SelectValue placeholder='Selecione o estilo' />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Input
                id='suffix'
                label='Sufixo da cena'
                placeholder='Ex: planta, seção-aa...'
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                onKeyPress={handleDialogKeyPress}
              />
            </div>
          </div>
          <DialogFooter className='flex gap-2'>
            <div className='w-full flex gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => {
                  setIsDuplicateDialogOpen(false);
                  setSelectedStyle('');
                  setSuffix('');
                }}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                size='sm'
                onClick={handleDuplicateScene}
                disabled={isProcessing}
              >
                <Copy className='w-4 h-4 mr-2' />
                Criar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
