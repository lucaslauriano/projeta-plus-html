'use client';

import React from 'react';
import { Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

interface AddLayerWithGroupDialogsProps {
  isTagDialogOpen: boolean;
  setIsTagDialogOpen: (open: boolean) => void;
  newTagName: string;
  setNewTagName: (name: string) => void;
  newTagColor: string;
  setNewTagColor: (color: string) => void;
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  handleAddTag: () => Promise<void>;
  folders: Array<{ name: string }>;
}

export default function AddLayerWithGroupDialogs({
  isTagDialogOpen,
  setIsTagDialogOpen,
  newTagName,
  setNewTagName,
  newTagColor,
  setNewTagColor,
  selectedFolder,
  setSelectedFolder,
  handleAddTag,
  folders,
}: AddLayerWithGroupDialogsProps) {
  return (
    <>
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader className='items-start text-left'>
            <DialogTitle>Criar nova tag</DialogTitle>
            <DialogDescription>
              Crie tags com cores personalizadas para organizar seu modelo.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-2'>
            <Input
              id='tag-name'
              label='Nome da Tag'
              placeholder='Ex: Paredes'
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag();
                }
              }}
              autoFocus
            />
            <Input
              type='color'
              label='Cor'
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className='cursor-pointer'
            />
            <Select
              label='Pasta'
              value={selectedFolder}
              onValueChange={setSelectedFolder}
            >
              <SelectTrigger>
                <SelectValue placeholder='Sem Pasta' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='root'>Sem Pasta</SelectItem>
                {folders.map((f, i) => (
                  <SelectItem key={i} value={f.name}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className='!flex !flex-row !justify-between gap-2 w-full'>
            <Button
              size='sm'
              variant='outline'
              className='flex-1'
              onClick={() => {
                setIsTagDialogOpen(false);
                setNewTagName('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddTag} size='sm' className='flex-1'>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
