'use client';

import React from 'react';
import { ViewConfigEditDialog } from './view-config-edit-dialog';

interface SceneEditDialogProps {
  style: string;
  isOpen: boolean;
  onSave: () => void;
  isBusy?: boolean;
  onCancel: () => void;
  sceneTitle: string;
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
  onSceneTitleChange?: (title: string) => void; // Nova prop
}

export function SceneEditDialog(props: SceneEditDialogProps) {
  return (
    <ViewConfigEditDialog
      {...props}
      title='Configuração da Cena'
      itemTitle={props.sceneTitle}
      onItemTitleChange={props.onSceneTitleChange}
      allowedCameraTypes={['iso_perspectiva', 'iso_ortogonal']}
    />
  );
}
