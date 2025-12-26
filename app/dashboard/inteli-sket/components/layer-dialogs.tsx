'use client';

import React from 'react';
import { Folder, Tag } from 'lucide-react';
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LayerDialogsProps {
  // Folder Dialog
  isFolderDialogOpen: boolean;
  setIsFolderDialogOpen: (open: boolean) => void;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  handleAddFolder: () => Promise<void>;

  // Tag Dialog
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

export default function LayerDialogs({
  isFolderDialogOpen,
  setIsFolderDialogOpen,
  newFolderName,
  setNewFolderName,
  handleAddFolder,
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
}: LayerDialogsProps) {
  return (
    <>
      <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Pasta</DialogTitle>
            <DialogDescription>
              Organize suas tags em pastas personalizadas.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Input
                id='folder-name'
                label='Nome da Pasta'
                placeholder='Ex: Estrutura'
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddFolder();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                setIsFolderDialogOpen(false);
                setNewFolderName('');
              }}
            >
              Cancelar
            </Button>
            <Button size='sm' onClick={handleAddFolder}>
              <Folder className='w-4 h-4 mr-2' />
              Criar Pasta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tag</DialogTitle>
            <DialogDescription>
              Crie tags com cores personalizadas para organizar seu modelo.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
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
            </div>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-foreground'>
                Cor
              </label>
              <input
                type='color'
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className='h-11 w-full rounded-xl cursor-pointer border-2 border-border p-1'
              />
            </div>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-foreground'>
                Pasta (Opcional)
              </label>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className='h-11 rounded-xl border-2 w-full'>
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
          </div>
          <DialogFooter>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                setIsTagDialogOpen(false);
                setNewTagName('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddTag} size='sm'>
              <Tag className='w-4 h-4 mr-2' />
              Criar Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
