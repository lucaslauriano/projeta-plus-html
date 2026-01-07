'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface GroupNameEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  onGroupNameChange: (name: string) => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export function GroupNameEditDialog({
  open,
  disabled = false,
  groupName,
  onConfirm,
  onOpenChange,
  onGroupNameChange,
}: GroupNameEditDialogProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && groupName.trim()) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className='items-start text-left'>
          <DialogTitle>Editar nome do grupo</DialogTitle>
          <DialogDescription className='flex text-start items-center justify-start text-xs text-muted-foreground'>
            Digite o novo nome para o grupo
          </DialogDescription>
        </DialogHeader>
        <div className='py-2'>
          <Input
            id='group-name'
            placeholder='Ex: Térreo, Pavimento 1...'
            value={groupName}
            label='Nome do grupo'
            onChange={(e) => onGroupNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <DialogFooter className='!flex !flex-row !justify-between gap-2 w-full'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='flex-1'
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            size='sm'
            disabled={disabled || !groupName.trim()}
            className='flex-1'
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
