'use client';

import React from 'react';
import {
  Save,
  Upload,
  Download,
  FolderOpen,
  PlusCircle,
  FolderPlus,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ViewConfigMenuProps {
  isBusy: boolean;
  entityLabel: string;
  onAddGroup: () => void;
  onAddItem: () => void;
  onLoadFromJson: () => void;
  onLoadDefault: () => void;
  onLoadFromFile: () => void;
  onSaveToJson: () => void;
}

export function ViewConfigMenu({
  isBusy,
  entityLabel,
  onAddGroup,
  onAddItem,
  onLoadFromJson,
  onLoadDefault,
  onLoadFromFile,
  onSaveToJson,
}: ViewConfigMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='p-1 hover:bg-accent rounded-md transition-colors'>
          <MoreVertical className='w-4 h-4 text-muted-foreground' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem className='cursor-pointer' onClick={onAddGroup}>
          <FolderPlus className='w-4 h-4 mr-2' />
          Adicionar Grupo
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={onAddItem}>
          <PlusCircle className='w-4 h-4 mr-2' />
          Adicionar {entityLabel}
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={onLoadFromJson}>
          <FolderOpen className='w-4 h-4 mr-2' />
          Carregar Salvo
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={onLoadDefault}>
          <Download className='w-4 h-4 mr-2' />
          Carregar Padrão
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={onLoadFromFile}>
          <Upload className='w-4 h-4 mr-2' />
          Importar Arquivo
        </DropdownMenuItem>
        <DropdownMenuItem
          className='cursor-pointer'
          onClick={onSaveToJson}
          disabled={isBusy}
        >
          <Save className='w-4 h-4 mr-2' />
          Salvar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
