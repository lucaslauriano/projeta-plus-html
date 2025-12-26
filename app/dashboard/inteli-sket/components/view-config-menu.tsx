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
  Edit,
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
  onEdit?: () => void;
  onAddItem?: () => void;
  onAddGroup?: () => void;
  onSaveToJson?: () => void;
  onLoadDefault?: () => void;
  onLoadFromJson?: () => void;
  onLoadFromFile?: () => void;
  onDeleteAll?: () => void;
  menuItems?: Array<{ label: string; action: () => void; hasDivider: boolean }>;
}

export function ViewConfigMenu({
  isBusy,
  onEdit,
  onAddItem,
  onAddGroup,
  entityLabel,
  onSaveToJson,
  onLoadDefault,
  onLoadFromJson,
  onLoadFromFile,
  onDeleteAll,
  menuItems = [],
}: ViewConfigMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='p-1 hover:bg-accent rounded-md transition-colors'>
          <MoreVertical className='w-4 h-4 text-muted-foreground' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <DropdownMenuItem className='cursor-pointer' onClick={item.action}>
              {item.label}
            </DropdownMenuItem>
            {item.hasDivider && (
              <hr className='my-1 border-muted-foreground/20' />
            )}
          </React.Fragment>
        ))}
        {onEdit && (
          <DropdownMenuItem className='cursor-pointer' onClick={onEdit}>
            <Edit className='w-4 h-4 mr-2' />
            Editar
          </DropdownMenuItem>
        )}
        {onAddGroup && (
          <DropdownMenuItem className='cursor-pointer' onClick={onAddGroup}>
            <FolderPlus className='w-4 h-4 mr-2' />
            Adicionar Grupo
          </DropdownMenuItem>
        )}
        {onAddItem && (
          <DropdownMenuItem className='cursor-pointer' onClick={onAddItem}>
            <PlusCircle className='w-4 h-4 mr-2' />
            Adicionar {entityLabel}
          </DropdownMenuItem>
        )}
        {onLoadFromJson && (
          <DropdownMenuItem className='cursor-pointer' onClick={onLoadFromJson}>
            <FolderOpen className='w-4 h-4 mr-2' />
            Carregar Salvo
          </DropdownMenuItem>
        )}
        {onLoadDefault && (
          <DropdownMenuItem className='cursor-pointer' onClick={onLoadDefault}>
            <Download className='w-4 h-4 mr-2' />
            Carregar Padrão
          </DropdownMenuItem>
        )}
        {onLoadFromFile && (
          <DropdownMenuItem className='cursor-pointer' onClick={onLoadFromFile}>
            <Upload className='w-4 h-4 mr-2' />
            Importar Arquivo
          </DropdownMenuItem>
        )}
        {onSaveToJson && (
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={onSaveToJson}
            disabled={isBusy}
          >
            <Save className='w-4 h-4 mr-2' />
            Salvar
          </DropdownMenuItem>
        )}
        {onDeleteAll && (
          <DropdownMenuItem className='cursor-pointer' onClick={onDeleteAll}>
            <Edit className='w-4 h-4 mr-2' />
            Deletar Todos
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
