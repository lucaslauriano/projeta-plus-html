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
import { Label } from '@/components/ui/label';

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
        <DialogHeader>
          <DialogTitle>Criar Seções por Ambiente</DialogTitle>
          <DialogDescription>
            Selecione um objeto no modelo e informe o nome do ambiente
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='environment-name'>Nome do Ambiente</Label>
            <Input
              id='environment-name'
              placeholder='Ex: cozinha, banheiro...'
              value={environmentName}
              onChange={(e) => onEnvironmentNameChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            size='sm'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button size='sm' onClick={onConfirm} disabled={disabled}>
            Criar Vistas
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
