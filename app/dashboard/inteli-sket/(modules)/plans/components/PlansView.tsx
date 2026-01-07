'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePlansManager } from '@/hooks/usePlansManager';
import { usePlansDialogs } from '@/hooks/usePlansDialogs';
import { usePlanEditor } from '@/hooks/usePlanEditor';
import { useBasePlansConfig } from '@/hooks/useBasePlansConfig';
import { useConfirm } from '@/hooks/useConfirm';
import { PlansToolbar } from './PlansToolbar';
import { PlansContent } from './PlansContent';
import { PlansDialogs } from './PlansDialogs';
import type { Plan } from '@/types/plans.types';

/**
 * Componente principal de visualização de plantas
 * Orquestra os sub-componentes e gerencia o estado local dos diálogos
 */
export default function PlansView() {
  const { ConfirmDialog } = useConfirm();
  const manager = usePlansManager();
  const dialogs = usePlansDialogs();

  // Estados locais para edição de grupo
  const [editGroupDialog, setEditGroupDialog] = useState({
    isOpen: false,
    groupId: null as string | null,
    groupName: '',
  });

  // Editor de plantas
  const editor = usePlanEditor(
    { groups: manager.groups, plans: [] },
    manager.availableStyles,
    manager.availableLayers,
    manager.getCurrentState,
    manager.currentState,
    () => {}, // setData não é mais necessário aqui
    async () => {} // saveToJson será chamado pelo manager
  );

  // Base plans config
  const baseConfig = useBasePlansConfig(
    manager.basePlansData,
    async () => {} // savePlans será chamado internamente
  );

  // ========================================
  // HANDLERS - Grupos
  // ========================================

  const handleAddGroup = useCallback(
    async (name: string) => {
      const success = await manager.addGroup(name);
      if (success) {
        dialogs.groupDialog.reset();
      }
      return success;
    },
    [manager, dialogs.groupDialog]
  );

  const handleEditGroup = useCallback(
    (groupId: string) => {
      const group = manager.groups.find((g) => g.id === groupId);
      if (!group) return;

      setEditGroupDialog({
        isOpen: true,
        groupId,
        groupName: group.name,
      });
    },
    [manager.groups]
  );

  const handleConfirmEditGroup = useCallback(async () => {
    if (!editGroupDialog.groupId || !editGroupDialog.groupName.trim()) {
      toast.error('Nome inválido');
      return;
    }

    const success = await manager.updateGroup(
      editGroupDialog.groupId,
      editGroupDialog.groupName
    );

    if (success) {
      setEditGroupDialog({
        isOpen: false,
        groupId: null,
        groupName: '',
      });
    }
  }, [editGroupDialog, manager]);

  const handleGroupDialogKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAddGroup(dialogs.groupDialog.name);
      }
    },
    [dialogs.groupDialog.name, handleAddGroup]
  );

  // ========================================
  // HANDLERS - Plantas
  // ========================================

  const handleAddPlan = useCallback(async () => {
    if (!dialogs.planDialog.title.trim()) {
      toast.error('Digite um título para a planta');
      return;
    }

    if (
      !dialogs.planDialog.selectedGroup.trim() ||
      dialogs.planDialog.selectedGroup === 'root'
    ) {
      toast.error('Selecione um grupo para a planta');
      return;
    }

    const newPlan = {
      name: dialogs.planDialog.title.trim(),
      code: dialogs.planDialog.title.trim().toLowerCase().replace(/\s+/g, '_'),
      style: manager.currentState?.style || 'PRO_PLANTAS',
      cameraType: manager.currentState?.cameraType || 'topo_ortogonal',
      activeLayers: manager.currentState?.activeLayers || [],
    };

    const success = await manager.addPlan(
      dialogs.planDialog.selectedGroup,
      newPlan
    );
    if (success) {
      dialogs.planDialog.reset();
    }
  }, [dialogs.planDialog, manager]);

  const handleEditPlan = useCallback(
    (plan: Plan) => {
      editor.openEditor(plan);
      dialogs.editDialog.open(
        plan as unknown as {
          id: string;
          title: string;
          segments: { id: string; name: string }[];
        }
      );
    },
    [editor, dialogs.editDialog]
  );

  const handleSaveEditPlan = useCallback(async () => {
    const success = await editor.saveEdits(manager.groups);
    if (success) {
      dialogs.editDialog.close();
    }
  }, [editor, manager.groups, dialogs.editDialog]);

  const handleCancelEdit = useCallback(() => {
    editor.closeEditor();
    dialogs.editDialog.close();
  }, [editor, dialogs.editDialog]);

  const handlePlanDialogKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleAddPlan();
    },
    [handleAddPlan]
  );

  const handleApplyCurrentStateBasePlans = useCallback(async () => {
    await manager.getCurrentState();
    if (manager.currentState) {
      editor.setEditActiveLayers(manager.currentState.activeLayers);
      toast.success('Estado atual aplicado!');
    }
  }, [manager, editor]);

  return (
    <>
      <div className='space-y-3'>
        <PlansToolbar
          isLoading={manager.isLoading}
          onCreateGroup={dialogs.groupDialog.open}
          onCreatePlan={dialogs.planDialog.open}
          onConfigureBase={dialogs.configDialog.open}
          onRestoreDefault={manager.loadDefault}
        />

        <div className='flex flex-col gap-3 w-full'>
          <Button
            size='sm'
            className='w-full flex items-center gap-3 justify-center'
            variant='default'
            onClick={dialogs.levelsDialog.open}
          >
            <Plus className='w-5 h-5' />
            <span>Gerenciar Níveis</span>
          </Button>
        </div>

        <PlansContent
          groups={manager.sortedGroups}
          isLoading={manager.isLoading}
          onEditGroup={handleEditGroup}
          onDeleteGroup={manager.deleteGroup}
          onEditPlan={handleEditPlan}
          onDeletePlan={manager.deletePlan}
          onDuplicatePlan={manager.duplicatePlan}
          onApplyPlan={manager.applyPlan}
        />
      </div>

      <PlansDialogs
        groupDialog={dialogs.groupDialog}
        onAddGroup={handleAddGroup}
        onGroupDialogKeyPress={handleGroupDialogKeyPress}
        planDialog={dialogs.planDialog}
        groups={manager.groups}
        onAddPlan={handleAddPlan}
        onPlanDialogKeyPress={handlePlanDialogKeyPress}
        editGroupDialog={{
          ...editGroupDialog,
          setOpen: (open: boolean) =>
            setEditGroupDialog((prev) => ({ ...prev, isOpen: open })),
          setGroupName: (name: string) =>
            setEditGroupDialog((prev) => ({ ...prev, groupName: name })),
        }}
        onConfirmEditGroup={handleConfirmEditGroup}
        isBusy={manager.isBusy}
        editPlanDialog={dialogs.editDialog}
        planEditor={editor}
        availableStyles={manager.availableStyles}
        availableLayers={manager.availableLayers}
        onSaveEditPlan={handleSaveEditPlan}
        onCancelEdit={handleCancelEdit}
        configDialog={dialogs.configDialog}
        bp_availableStyles={manager.availableStyles}
        bp_availableLayers={manager.availableLayers}
        onSaveBasePlansConfig={() => baseConfig.saveConfig(true)}
        onApplyCurrentStateBasePlans={handleApplyCurrentStateBasePlans}
        baseConfig={{
          code: baseConfig.baseCode || 'base',
          style: baseConfig.baseStyle,
          layers: baseConfig.baseLayers,
          updateCode: baseConfig.updateBaseCode,
          updateStyle: baseConfig.updateBaseStyle,
          updateLayers: baseConfig.updateBaseLayers,
        }}
        ceilingConfig={{
          code: baseConfig.ceilingCode || 'forro',
          style: baseConfig.ceilingStyle,
          layers: baseConfig.ceilingLayers,
          updateCode: baseConfig.updateCeilingCode,
          updateStyle: baseConfig.updateCeilingStyle,
          updateLayers: baseConfig.updateCeilingLayers,
        }}
        levelsDialog={dialogs.levelsDialog}
      />

      <ConfirmDialog />
    </>
  );
}
