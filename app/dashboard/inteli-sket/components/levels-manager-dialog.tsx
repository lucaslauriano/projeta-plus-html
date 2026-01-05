'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Trash2,
  Loader2,
  Building2,
  ArrowUpToLine,
  ArrowDownToLine,
} from 'lucide-react';
import { useLevels } from '@/hooks/useLevels';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LevelsManagerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LevelsManagerDialog({
  isOpen,
  onOpenChange,
}: LevelsManagerDialogProps) {
  const {
    levels,
    isBusy,
    addLevel,
    removeLevel,
    createBaseScene,
    createCeilingScene,
    ConfirmDialog,
  } = useLevels();

  const [heightInput, setHeightInput] = useState('0.00');

  function handleAddLevel() {
    const height = parseFloat(heightInput.replace(',', '.'));

    if (isNaN(height)) {
      toast.error('Digite uma altura válida');
      return;
    }

    addLevel(height);
    setHeightInput('0.00');
  }

  function formatHeight(meters: number): string {
    return meters.toFixed(2) + 'm';
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-h-[900px] overflow-y-auto'>
        <DialogHeader>
          <div className='flex flex-col gap-2 items-end justify-end w-full'>
            <div>
              <DialogTitle className='flex text-start gap-2 text-xl'>
                Gerenciador de Níveis
              </DialogTitle>
              <DialogDescription className='flex text-start items-center justify-start text-xs text-muted-foreground'>
                Configure os níveis do projeto e crie as cenas de planta baixa e
                forro
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-3 w-full'>
          <div className='flex gap-4 items-end justify-between'>
            <div className='w-full'>
              <Input
                id='height'
                type='text'
                label='Altura do Nível (m)'
                value={heightInput}
                onChange={(e) => setHeightInput(e.target.value)}
                className='h-8'
                placeholder='Ex: 0.00'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddLevel();
                  }
                }}
              />
            </div>

            <Button
              size='sm'
              variant='default'
              onClick={handleAddLevel}
              disabled={isBusy}
            >
              {isBusy ? (
                <Loader2 className='w-4 h-4 animate-spin ' />
              ) : (
                <Plus className='w-4 h-4 ' />
              )}
              Criar
            </Button>
          </div>

          {levels.length === 0 ? (
            <div className='w-full text-center py-12 text-muted-foreground'>
              <Building2 className='w-16 h-16 mx-auto mb-4 opacity-20' />
              <p className='text-lg mb-2'>Nenhum nível cadastrado ainda</p>
              <p className='text-sm'>
                Adicione o primeiro nível acima para começar
              </p>
            </div>
          ) : (
            <div className='border rounded-lg overflow-auto w-full max-h-[300px] overflow-y-auto'>
              {levels.reverse().map((level) => (
                <div
                  key={level.number}
                  className='hover:bg-muted/30 flex items-center justify-between py-2 border-b border-border/50 last:border-b-0 P'
                >
                  <span className='text-muted-foreground text-sm pl-4'>
                    <p className='text-sm font-bold'>{level.name}</p>
                    <p className='flex items-center gap-2  text-muted-foreground text-sm'>
                      <span className='font-bold text-sm'>Nível:</span>{' '}
                      {formatHeight(level.height_meters)}
                    </p>
                  </span>
                  <div className='flex items-center gap-2 pr-4'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='cursor-pointer justify-between w-fit'
                            onClick={() => createBaseScene(level.number)}
                            disabled={isBusy}
                          >
                            <ArrowDownToLine className='w-3 h-3' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Criar planta base</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='cursor-pointer justify-between w-fit'
                            onClick={() => createCeilingScene(level.number)}
                            disabled={isBusy}
                          >
                            <ArrowUpToLine className='w-3 h-3' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Criar planta de forro</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='cursor-pointer justify-between w-fit'
                            onClick={() => removeLevel(level.number)}
                            disabled={isBusy}
                          >
                            <Trash2 className='w-3 h-3' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remover nível</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
      <ConfirmDialog />
    </Dialog>
  );
}
