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
import { LucideIcon } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

interface AddItemWithGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  itemLabel: string;
  itemPlaceholder: string;
  itemValue: string;
  onItemValueChange: (value: string) => void;
  groupLabel?: string;
  selectedGroup: string;
  onSelectedGroupChange: (group: string) => void;
  groups: Array<{ id: string; name: string }>;
  onAdd: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  confirmButtonText?: string;
  confirmButtonIcon?: LucideIcon;
  cancelButtonText?: string;
}

export function AddItemWithGroupDialog({
  isOpen,
  title,
  description,
  itemLabel,
  itemPlaceholder,
  itemValue,
  onAdd,
  onKeyPress,
  onOpenChange,
  onItemValueChange,
  onSelectedGroupChange,
  groups,
  groupLabel = 'Grupo',
  selectedGroup,
  confirmButtonText = 'Criar',
  confirmButtonIcon: Icon,
  cancelButtonText = 'Cancelar',
}: AddItemWithGroupDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='items-start text-left'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-2'>
          <div className='space-y-2'>
            <Input
              id='item-name'
              label={itemLabel}
              placeholder={itemPlaceholder}
              value={itemValue}
              onChange={(e) => onItemValueChange(e.target.value)}
              onKeyPress={onKeyPress}
              autoFocus
            />
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-semibold text-foreground'>
              {groupLabel}
            </label>
            <Select value={selectedGroup} onValueChange={onSelectedGroupChange}>
              <SelectTrigger>
                <SelectValue placeholder='Sem Grupo' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='root'>Sem Grupo</SelectItem>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className='!flex !flex-row !justify-between gap-2 w-full'>
          <Button
            size='sm'
            variant='outline'
            className='flex-1'
            onClick={() => {
              onOpenChange(false);
              onItemValueChange('');
            }}
          >
            {cancelButtonText}
          </Button>
          <Button onClick={onAdd} size='sm' className='flex-1'>
            {Icon && <Icon className='w-4 h-4 mr-2' />}
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
