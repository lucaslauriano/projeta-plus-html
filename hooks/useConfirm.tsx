'use client';

import { useState, useCallback } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    description: '',
  });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolver) {
      resolver(true);
      setResolver(null);
    }
    setIsOpen(false);
  }, [resolver]);

  const handleCancel = useCallback(() => {
    if (resolver) {
      resolver(false);
      setResolver(null);
    }
    setIsOpen(false);
  }, [resolver]);

  const ConfirmDialogComponent = useCallback(
    () => (
      <ConfirmDialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
        title={options.title}
        description={options.description}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        onConfirm={handleConfirm}
        variant={options.variant}
      />
    ),
    [isOpen, options, handleConfirm, handleCancel]
  );

  return { confirm, ConfirmDialog: ConfirmDialogComponent };
}

