'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
          <DialogDescription className='text-left'>
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
        <DialogFooter className='flex justify-between gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              onOpenChange(false);
              onInputChange('');
            }}
          >
            {cancelButtonText}
          </Button>
          <Button onClick={onAdd} size='sm'>
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


