'use client';

import React from 'react';
import { ViewConfigEditDialog } from './view-config-edit-dialog';

interface PlanEditDialogProps {
  style: string;
  isOpen: boolean;
  onSave: () => void;
  isBusy?: boolean;
  onCancel: () => void;
  planTitle: string;
  cameraType: string;
  activeLayers: string[];
  onOpenChange: (open: boolean) => void;
  onStyleChange: (style: string) => void;
  onImportStyle?: () => void;
  availableStyles: string[];
  availableLayers: string[];
  onSelectNoLayers: () => void;
  onSelectAllLayers: () => void;
  onCameraTypeChange: (type: string) => void;
  onApplyCurrentState: () => void;
  onActiveLayersChange: (layers: string[]) => void;
  onPlanTitleChange?: (title: string) => void; // Nova prop
}

export function PlanEditDialog(props: PlanEditDialogProps) {
  return (
    <ViewConfigEditDialog
      {...props}
      title='Configuração da Planta'
      itemTitle={props.planTitle}
      onItemTitleChange={props.onPlanTitleChange}
      allowedCameraTypes={[
        'topo_perspectiva',
        'topo_ortogonal',
        'iso_invertida_perspectiva',
        'iso_invertida_ortogonal',
      ]}
    />
  );
}
