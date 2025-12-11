import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { FileText, Edit, Copy, Trash2 } from 'lucide-react';
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
  const [contextMenuOpen, setContextMenuOpen] = React.useState(false);
  const [contextMenuPosition, setContextMenuPosition] = React.useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  };

  return (
    <DropdownMenu open={contextMenuOpen} onOpenChange={setContextMenuOpen}>
      <Button
        className='flex items-center justify-between p-2 rounded-lg border transition-colors w-full bg-primary'
        onClick={(e) => {
          e.stopPropagation();
          if (onLoadFromJson) {
            onLoadFromJson();
          }
        }}
        onContextMenu={handleContextMenu}
      >
        <div className='flex items-center gap-2 text-sm font-medium'>
          <FileText className='w-4 h-4 text-primary-foreground' />
          <p className='text-sm font-medium'>{title}</p>
        </div>
      </Button>
      <DropdownMenuContent 
        align='start' 
        className='min-w-[140px]'
        style={{
          position: 'fixed',
          left: `${contextMenuPosition.x}px`,
          top: `${contextMenuPosition.y}px`,
        }}
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
