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

export default function DetailsComponent() {
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');

  function handleDuplicateScenes() {
    // TODO: Implement scene duplication logic
    console.log('Duplicating scenes with:', { prefix, suffix });
    setIsDuplicateDialogOpen(false);
    setPrefix('');
    setSuffix('');
  }

  function handleDialogKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleDuplicateScenes();
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
          <Button variant='default'>
            <LayoutGrid className='w-5 h-5' />
            Detalhamento Marcenaria
          </Button>

          <Button variant='default'>
            <Grid3x3 className='w-5 h-5' />
            Detalhamento Geral
          </Button>

          <Button
            variant='default'
            onClick={() => setIsDuplicateDialogOpen(true)}
          >
            <Copy className='w-5 h-5' />
            Duplicar Cenas
          </Button>

          <Button variant='default'>
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
            <DialogTitle>Duplicar Cenas</DialogTitle>
            <DialogDescription>
              Adicione prefixo ou sufixo para duplicar as cenas selecionadas.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold mb-2 text-foreground'>
                Estilos
              </label>
              <Select value={prefix} onValueChange={setPrefix}>
                <SelectTrigger className='h-11 rounded-xl border-2'>
                  <SelectValue placeholder='Selecione o prefixo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Novo_'>Novo_</SelectItem>
                  <SelectItem value='Copy_'>Copy_</SelectItem>
                  <SelectItem value='Duplicado_'>Duplicado_</SelectItem>
                  <SelectItem value='V2_'>V2_</SelectItem>
                  <SelectItem value='Alt_'>Alt_</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Input
                id='suffix'
                label='Sufixo'
                placeholder='Ex: _Copia'
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                onKeyPress={handleDialogKeyPress}
              />
            </div>
          </div>
          <DialogFooter className='flex gap-2'>
            <div className='w-full flex gap-2'>
              <Button
                className=''
                variant='outline'
                onClick={() => {
                  setIsDuplicateDialogOpen(false);
                  setPrefix('');
                  setSuffix('');
                }}
              >
                <Copy className='w-4 h-4 mr-2' />
                Cancelar
              </Button>
              <Button onClick={handleDuplicateScenes}>
                <Copy className='w-4 h-4 mr-2' />
                Duplicar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
