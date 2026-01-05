'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

interface AddItemDialogProps {
  isOpen: boolean;
  onAdd: () => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onOpenChange: (open: boolean) => void;
  onInputChange: (value: string) => void;
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputValue: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export function AddItemDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  inputLabel,
  inputPlaceholder,
  inputValue,
  onInputChange,
  onAdd,
  onKeyPress,
  confirmButtonText = 'Criar',
  cancelButtonText = 'Cancelar',
}: AddItemDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='items-start text-left'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className='flex text-start items-center justify-start text-xs text-muted-foreground'>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-2'>
          <div className='space-y-2'>
            <Input
              id='item-name'
              label={inputLabel}
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={onKeyPress}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className='!flex !flex-row !justify-between gap-2 w-full'>
          <Button
            size='sm'
            variant='outline'
            className='flex-1'
            onClick={() => {
              onOpenChange(false);
              onInputChange('');
            }}
          >
            {cancelButtonText}
          </Button>
          <Button onClick={onAdd} size='sm' className='flex-1'>
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
