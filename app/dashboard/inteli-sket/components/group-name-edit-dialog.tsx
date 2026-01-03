'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
          <DialogDescription>Digite o novo nome para o grupo</DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='group-name'>Nome do grupo</Label>
            <Input
              id='group-name'
              placeholder='Ex: Térreo, Pavimento 1...'
              value={groupName}
              onChange={(e) => onGroupNameChange(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            size='sm'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            size='sm'
            disabled={disabled || !groupName.trim()}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
