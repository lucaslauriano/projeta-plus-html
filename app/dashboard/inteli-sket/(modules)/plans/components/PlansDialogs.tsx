'use client';

import React from 'react';
import { AddItemDialog } from '@/app/dashboard/inteli-sket/components/add-item-dialog';
import { AddItemWithGroupDialog } from '@/app/dashboard/inteli-sket/components/add-item-with-group-dialog';
import { GroupNameEditDialog } from '@/app/dashboard/inteli-sket/components/group-name-edit-dialog';
import { ViewConfigDialog } from '@/app/dashboard/inteli-sket/components/view-config-dialog';
import { BasePlansConfigDialog } from '@/app/dashboard/inteli-sket/components/base-plans-config-dialog';
import { LevelsManagerDialog } from '@/app/dashboard/inteli-sket/components/levels-manager-dialog';
import type { PlanGroup } from '@/types/plans.types';

interface PlansDialogsProps {
  // Group Dialog
  groupDialog: {
    isOpen: boolean;
    name: string;
    setOpen: (open: boolean) => void;
    setName: (name: string) => void;
    reset: () => void;
  };
  onAddGroup: (name: string) => Promise<boolean>;
  onGroupDialogKeyPress: (e: React.KeyboardEvent) => void;

  // Plan Dialog
  planDialog: {
    isOpen: boolean;
    title: string;
    selectedGroup: string;
    setOpen: (open: boolean) => void;
    setTitle: (title: string) => void;
    setSelectedGroup: (group: string) => void;
    reset: () => void;
  };
  groups: PlanGroup[];
  onAddPlan: () => Promise<void>;
  onPlanDialogKeyPress: (e: React.KeyboardEvent) => void;

  // Edit Group Dialog
  editGroupDialog: {
    isOpen: boolean;
    groupId: string | null;
    groupName: string;
    setOpen: (open: boolean) => void;
    setGroupName: (name: string) => void;
  };
  onConfirmEditGroup: () => Promise<void>;
  isBusy: boolean;

  // Edit Plan Dialog
  editPlanDialog: {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
  };
  planEditor: {
    editPlanName: string;
    editPlanCode: string;
    editPlanStyle: string;
    editCameraType: string;
    editActiveLayers: string[];
    setEditPlanName: (name: string) => void;
    setEditPlanCode: (code: string) => void;
    setEditPlanStyle: (style: string) => void;
    setEditCameraType: (type: string) => void;
    setEditActiveLayers: (layers: string[]) => void;
    selectNoLayers: () => void;
    selectAllLayers: () => void;
    applyCurrentState: () => Promise<void>;
  };
  availableStyles: string[];
  availableLayers: string[];
  onSaveEditPlan: () => Promise<void>;
  onCancelEdit: () => void;

  // Base Plans Config Dialog
  configDialog: {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
  };
  bp_availableStyles: string[];
  bp_availableLayers: string[];
  onSaveBasePlansConfig: () => void;
  onApplyCurrentStateBasePlans: () => Promise<void>;
  baseConfig: {
    code: string;
    style: string;
    layers: string[];
    updateCode: (code: string) => void;
    updateStyle: (style: string) => void;
    updateLayers: (layers: string[]) => void;
  };
  ceilingConfig: {
    code: string;
    style: string;
    layers: string[];
    updateCode: (code: string) => void;
    updateStyle: (style: string) => void;
    updateLayers: (layers: string[]) => void;
  };

  // Levels Dialog
  levelsDialog: {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
  };
}

/**
 * Centraliza todos os diálogos do módulo de plantas
 * Componente orquestrador de diálogos
 */
export function PlansDialogs({
  groupDialog,
  onAddGroup,
  onGroupDialogKeyPress,
  planDialog,
  groups,
  onAddPlan,
  onPlanDialogKeyPress,
  editGroupDialog,
  onConfirmEditGroup,
  isBusy,
  editPlanDialog,
  planEditor,
  availableStyles,
  availableLayers,
  onSaveEditPlan,
  onCancelEdit,
  configDialog,
  bp_availableStyles,
  bp_availableLayers,
  onSaveBasePlansConfig,
  onApplyCurrentStateBasePlans,
  baseConfig,
  ceilingConfig,
  levelsDialog,
}: PlansDialogsProps) {
  return (
    <>
      {/* Dialog para adicionar grupo */}
      <AddItemDialog
        isOpen={groupDialog.isOpen}
        onOpenChange={groupDialog.setOpen}
        title='Criar novo grupo'
        description='Organize suas plantas em grupos personalizados.'
        inputLabel='Nome do grupo'
        inputPlaceholder='Ex: Pavimento Térreo'
        inputValue={groupDialog.name}
        onInputChange={groupDialog.setName}
        onAdd={async () => {
          const success = await onAddGroup(groupDialog.name);
          if (success) groupDialog.reset();
        }}
        onKeyPress={onGroupDialogKeyPress}
      />

      {/* Dialog para adicionar planta */}
      <AddItemWithGroupDialog
        groups={groups}
        isOpen={planDialog.isOpen}
        itemValue={planDialog.title}
        selectedGroup={planDialog.selectedGroup}
        title='Criar nova planta'
        description='Organize suas plantas em grupos personalizados.'
        itemLabel='Nome da planta'
        itemPlaceholder='Ex: Planta de Arquitetura'
        onAdd={onAddPlan}
        onKeyPress={onPlanDialogKeyPress}
        onOpenChange={planDialog.setOpen}
        onItemValueChange={planDialog.setTitle}
        onSelectedGroupChange={planDialog.setSelectedGroup}
      />

      {/* Dialog para editar nome do grupo */}
      <GroupNameEditDialog
        open={editGroupDialog.isOpen}
        onOpenChange={editGroupDialog.setOpen}
        groupName={editGroupDialog.groupName}
        onGroupNameChange={editGroupDialog.setGroupName}
        onConfirm={onConfirmEditGroup}
        disabled={isBusy}
      />

      {/* Dialog para editar planta */}
      <ViewConfigDialog
        title='Configuração da Planta'
        style={planEditor.editPlanStyle}
        onSave={onSaveEditPlan}
        isBusy={isBusy}
        isOpen={editPlanDialog.isOpen}
        onCancel={onCancelEdit}
        cameraType={planEditor.editCameraType}
        onOpenChange={editPlanDialog.setOpen}
        activeLayers={planEditor.editActiveLayers}
        onStyleChange={planEditor.setEditPlanStyle}
        availableStyles={availableStyles}
        availableLayers={availableLayers}
        onSelectNoLayers={planEditor.selectNoLayers}
        onSelectAllLayers={planEditor.selectAllLayers}
        onCameraTypeChange={planEditor.setEditCameraType}
        onApplyCurrentState={planEditor.applyCurrentState}
        onActiveLayersChange={planEditor.setEditActiveLayers}
        itemTitle={planEditor.editPlanName}
        itemCode={planEditor.editPlanCode}
        onItemTitleChange={planEditor.setEditPlanName}
        onItemCodeChange={planEditor.setEditPlanCode}
        allowedCameraTypes={[
          'topo_perspectiva',
          'topo_ortogonal',
          'iso_invertida_perspectiva',
          'iso_invertida_ortogonal',
        ]}
      />

      {/* Dialog para configurar base e forro */}
      <BasePlansConfigDialog
        onSave={onSaveBasePlansConfig}
        isOpen={configDialog.isOpen}
        isBusy={isBusy}
        baseStyle={baseConfig.style}
        baseLayers={baseConfig.layers}
        baseCode={baseConfig.code}
        ceilingCode={ceilingConfig.code}
        onOpenChange={configDialog.setOpen}
        ceilingStyle={ceilingConfig.style}
        ceilingLayers={ceilingConfig.layers}
        availableStyles={bp_availableStyles}
        availableLayers={bp_availableLayers}
        onBaseCodeChange={baseConfig.updateCode}
        onBaseStyleChange={baseConfig.updateStyle}
        onBaseLayersChange={baseConfig.updateLayers}
        onCeilingStyleChange={ceilingConfig.updateStyle}
        onCeilingLayersChange={ceilingConfig.updateLayers}
        onCeilingCodeChange={ceilingConfig.updateCode}
        onApplyCurrentState={onApplyCurrentStateBasePlans}
      />

      {/* Dialog para gerenciar níveis */}
      <LevelsManagerDialog
        isOpen={levelsDialog.isOpen}
        onOpenChange={levelsDialog.setOpen}
      />
    </>
  );
}
