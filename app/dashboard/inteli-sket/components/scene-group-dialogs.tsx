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
import { Folder, FileText } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

interface AddGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  onGroupNameChange: (name: string) => void;
  onAdd: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

export function AddGroupDialog({
  isOpen,
  onOpenChange,
  groupName,
  onGroupNameChange,
  onAdd,
  onKeyPress,
}: AddGroupDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Grupo</DialogTitle>
          <DialogDescription>
            Organize suas cenas em grupos personalizados.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <Input
              id='group-name'
              label='Nome do Grupo'
              placeholder='Ex: Arquitetônico'
              value={groupName}
              onChange={(e) => onGroupNameChange(e.target.value)}
              onKeyPress={onKeyPress}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              onOpenChange(false);
              onGroupNameChange('');
            }}
          >
            Cancelar
          </Button>
          <Button onClick={onAdd} size='sm'>
            <Folder className='w-4 h-4 mr-2' />
            Criar Grupo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AddSceneDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sceneTitle: string;
  onSceneTitleChange: (title: string) => void;
  selectedGroup: string;
  onSelectedGroupChange: (group: string) => void;
  groups: Array<{ id: string; name: string }>;
  onAdd: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

export function AddSceneDialog({
  isOpen,
  onOpenChange,
  sceneTitle,
  onSceneTitleChange,
  selectedGroup,
  onSelectedGroupChange,
  groups,
  onAdd,
  onKeyPress,
}: AddSceneDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Cena</DialogTitle>
          <DialogDescription>
            Crie uma nova cena e escolha em qual grupo ela ficará.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <Input
              id='scene-title'
              label='Nome da Cena'
              placeholder='Ex: Vista Frontal'
              value={sceneTitle}
              onChange={(e) => onSceneTitleChange(e.target.value)}
              onKeyPress={onKeyPress}
              autoFocus
            />
          </div>
          <div className='space-y-2'>
            <label className='block text-sm font-semibold text-foreground'>
              Grupo (Opcional)
            </label>
            <Select value={selectedGroup} onValueChange={onSelectedGroupChange}>
              <SelectTrigger className='h-11 rounded-xl border-2 w-full'>
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
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => {
              onOpenChange(false);
              onSceneTitleChange('');
            }}
          >
            Cancelar
          </Button>
          <Button onClick={onAdd}>
            <FileText className='w-4 h-4 mr-2' />
            Criar Cena
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
