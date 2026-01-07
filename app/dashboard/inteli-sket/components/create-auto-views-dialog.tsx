'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

interface CreateAutoViewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  environmentName: string;
  onEnvironmentNameChange: (name: string) => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export function CreateAutoViewsDialog({
  open,
  onOpenChange,
  environmentName,
  onEnvironmentNameChange,
  onConfirm,
  disabled = false,
}: CreateAutoViewsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size='sm' variant='default' disabled={disabled}>
          <Eye className='w-5 h-5' />
          Seções por ambiente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='text-start'>
          <DialogTitle>Criar Seções por Ambiente</DialogTitle>
          <DialogDescription>
            Selecione um objeto no modelo e informe o nome do ambiente
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-2'>
          <Input
            id='environment-name'
            label='Nome do Ambiente'
            placeholder='Ex: cozinha, banheiro...'
            value={environmentName}
            onChange={(e) => onEnvironmentNameChange(e.target.value)}
          />
        </div>
        <DialogFooter className='!flex !flex-row !justify-between gap-2 w-full'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='flex-1'
          >
            Cancelar
          </Button>
          <Button
            size='sm'
            onClick={onConfirm}
            disabled={disabled}
            className='flex-1'
          >
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
