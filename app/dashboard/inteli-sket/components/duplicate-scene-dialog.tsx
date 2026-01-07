'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface DuplicateSceneDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  styles: string[];
  selectedStyle: string;
  onSelectedStyleChange: (style: string) => void;
  suffix: string;
  onSuffixChange: (suffix: string) => void;
  onDuplicate: () => void;
  isProcessing?: boolean;
}

export function DuplicateSceneDialog({
  isOpen,
  onOpenChange,
  styles,
  selectedStyle,
  onSelectedStyleChange,
  suffix,
  onSuffixChange,
  onDuplicate,
  isProcessing = false,
}: DuplicateSceneDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
    onSelectedStyleChange('');
    onSuffixChange('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      onDuplicate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] flex flex-col gap-4'>
        <DialogHeader className='items-start text-left'>
          <DialogTitle>Duplicar cena</DialogTitle>
          <DialogDescription className='flex text-start items-center justify-start text-xs text-muted-foreground'>
            Selecione um estilo e adicione um sufixo para duplicar a cena atual.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-2'>
          <div className='space-y-2'>
            <Select
              label='Estilo'
              value={selectedStyle}
              onValueChange={onSelectedStyleChange}
            >
              <SelectTrigger>
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
              onChange={(e) => onSuffixChange(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className='flex justify-between gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            size='sm'
            onClick={onDuplicate}
            disabled={isProcessing || !selectedStyle || !suffix.trim()}
          >
            {isProcessing && <Loader2 className='w-4 h-4 animate-spin ' />}
            {isProcessing ? 'Duplicando...' : 'Duplicar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
