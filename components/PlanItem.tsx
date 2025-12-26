import React from 'react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, Edit, Copy, Trash2, ChevronDown } from 'lucide-react';

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
  const [contextMenuOpen, setContextMenuOpen] = React.useState(false);
  const [contextMenuPosition, setContextMenuPosition] = React.useState({
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setContextMenuPosition({ x: 0, y: 0 });
    }
    setContextMenuOpen(open);
  };

  return (
    <DropdownMenu open={contextMenuOpen} onOpenChange={handleOpenChange}>
      <div className='flex w-full' onContextMenu={handleContextMenu}>
        <button
          className='flex items-center justify-start gap-2 text-sm font-medium transition-colors flex-1 border-r-none rounded-r-none cursor-pointer h-8 rounded-md px-3 border bg-background shadow-xs hover:bg-accent/40 hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
          onClick={(e) => {
            e.stopPropagation();
            if (onLoadFromJson) {
              onLoadFromJson();
            }
          }}
        >
          <FileText className='w-4 h-4 text-primary' />
          <p className='text-sm font-medium'>{title}</p>
        </button>
        <DropdownMenuTrigger asChild>
          <button className='h-8 px-2 rounded-l-none border-l border bg-background shadow-xs hover:bg-accent/40 hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md'>
            <ChevronDown className='w-4 h-4 text-gray-500' />
          </button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent
        align='start'
        className='min-w-[140px]'
        style={
          contextMenuPosition.x > 0
            ? {
                position: 'fixed',
                left: `${contextMenuPosition.x}px`,
                top: `${contextMenuPosition.y}px`,
              }
            : undefined
        }
      >
        <DropdownMenuItem
          className='cursor-pointer justify-between'
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
            setContextMenuOpen(false);
          }}
        >
          Editar
          <Edit className='w-4 h-4' />
        </DropdownMenuItem>
        <DropdownMenuItem
          className='cursor-pointer justify-between'
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
            setContextMenuOpen(false);
          }}
        >
          Duplicar
          <Copy className='w-4 h-4' />
        </DropdownMenuItem>
        <DropdownMenuItem
          className='text-destructive focus:text-destructive cursor-pointer justify-between'
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
            setContextMenuOpen(false);
          }}
        >
          Deletar
          <Trash2 className='w-4 h-4' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
