'use client';

import React from 'react';
import { Scissors } from 'lucide-react';
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
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CreateIndividualSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionName: string;
  onSectionNameChange: (name: string) => void;
  direction: string;
  onDirectionChange: (direction: string) => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export function CreateIndividualSectionDialog({
  open,
  onOpenChange,
  sectionName,
  onSectionNameChange,
  direction,
  onDirectionChange,
  onConfirm,
  disabled = false,
}: CreateIndividualSectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size='sm' variant='default' disabled={disabled}>
          <Scissors className='w-5 h-5' />
          Seção Individual
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar seção individual</DialogTitle>
          <DialogDescription>
            Configure o nome e a direção do seção
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='section-name'>Nome da seção</Label>
            <Input
              id='section-name'
              placeholder='Ex: Cozinha, Banheiro...'
              value={sectionName}
              onChange={(e) => onSectionNameChange(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='section-direction'>Direção</Label>
            <Select value={direction} onValueChange={onDirectionChange}>
              <SelectTrigger id='section-direction'>
                <SelectValue placeholder='Selecione a direção' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='frente'>Frente</SelectItem>
                <SelectItem value='esquerda'>Esquerda</SelectItem>
                <SelectItem value='voltar'>Voltar</SelectItem>
                <SelectItem value='direita'>Direita</SelectItem>
              </SelectContent>
            </Select>
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
          <Button onClick={onConfirm} size='sm' disabled={disabled}>
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
