import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, MoreVertical, Edit, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlanItemProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onLoadFromJson?: () => void;
}

export function PlanItem({
  title,
  onEdit,
  onDelete,
  onDuplicate,
  onLoadFromJson,
}: PlanItemProps) {
  return (
    <Button
      className='flex items-center justify-between p-2 rounded-lg border transition-colors w-full bg-primary'
      onClick={(e) => {
        e.stopPropagation();
        if (onLoadFromJson) {
          onLoadFromJson();
        }
      }}
    >
      <div className='flex items-center gap-2 text-sm font-medium'>
        <FileText className='w-4 h-4 text-primary-foreground' />
        <p className='text-sm font-medium'>{title}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className='p-1 hover:bg-accent rounded-md transition-colors hover:text-muted-foreground'
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className='w-4 h-4 hover:text-muted-foreground' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-[140px]'>
          <DropdownMenuItem
            className='cursor-pointer justify-between'
            onClick={onEdit}
          >
            Editar
            <Edit className='w-4 h-4' />
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer justify-between'
            onClick={onDuplicate}
          >
            Duplicar
            <Copy className='w-4 h-4' />
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-destructive focus:text-destructive cursor-pointer justify-between'
            onClick={onDelete}
          >
            Deletar
            <Trash2 className='w-4 h-4' />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Button>
  );
}
