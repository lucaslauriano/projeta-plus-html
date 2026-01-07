'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';

interface PlansToolbarProps {
  isLoading: boolean;
  onCreateGroup: () => void;
  onCreatePlan: () => void;
  onConfigureBase: () => void;
  onRestoreDefault: () => void;
}

/**
 * Toolbar com título e menu de ações
 * Componente puro, apenas apresentação
 */
export function PlansToolbar({
  isLoading,
  onCreateGroup,
  onCreatePlan,
  onConfigureBase,
  onRestoreDefault,
}: PlansToolbarProps) {
  const menuItems = [
    {
      label: 'Criar grupo',
      action: onCreateGroup,
      hasDivider: false,
    },
    {
      label: 'Criar planta',
      action: onCreatePlan,
      hasDivider: false,
    },
    {
      label: 'Editar níveis',
      action: onConfigureBase,
      hasDivider: true,
    },
    {
      label: 'Restaurar padrão',
      action: onRestoreDefault,
      hasDivider: false,
    },
  ];

  return (
    <div className='flex items-center justify-between'>
      <h2 className='text-lg font-semibold flex items-center gap-2'>
        Plantas {isLoading && <Loader2 className='w-4 h-4 animate-spin' />}
      </h2>
      <div className='flex items-center gap-2'>
        <ViewConfigMenu menuItems={menuItems} />
      </div>
    </div>
  );
}
