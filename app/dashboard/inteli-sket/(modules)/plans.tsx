'use client';

import React, { useMemo, useState } from 'react';
import { PlanItem } from '@/components/PlanItem';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePlans } from '@/hooks/usePlans';
import type { PlanGroup } from '@/hooks/usePlans';
import { GroupAccordion } from '@/app/dashboard/inteli-sket/components/group-accordion';
import {
  ScenesSkeleton,
  ScenesEmptyState,
  ScenesLoadingState,
} from '@/app/dashboard/inteli-sket/components/scenes-skeleton';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';
import { LevelsManagerDialog } from '@/app/dashboard/inteli-sket/components/levels-manager-dialog';
import { Button } from '@/components/ui/button';
import { GroupNameEditDialog } from '@/app/dashboard/inteli-sket/components/group-name-edit-dialog';
import { AddItemDialog } from '@/app/dashboard/inteli-sket/components/add-item-dialog';
import { AddItemWithGroupDialog } from '@/app/dashboard/inteli-sket/components/add-item-with-group-dialog';
import { useBasePlans } from '@/hooks/useBasePlans';
import { usePlansDialogs } from '@/hooks/usePlansDialogs';
import { usePlanEditor } from '@/hooks/usePlanEditor';
import type { Plan } from '@/hooks/usePlanEditor';
import { useBasePlansConfig } from '@/hooks/useBasePlansConfig';
import { useConfirm } from '@/hooks/useConfirm';
import { ViewConfigDialog } from '@/app/dashboard/inteli-sket/components/view-config-dialog';

function PlansComponent() {
  console.log('PlansComponent');
  const { confirm, ConfirmDialog } = useConfirm();
  const {
    data,
    isBusy,
    isLoading,
    currentState,
    availableStyles,
    availableLayers,
    setData,
    saveToJson,
    loadDefault,
    getCurrentState,
    applyPlanConfig,
    //loadFromFile,
    //loadFromJson,
  } = usePlans();

  const {
    data: basePlansData,
    availableStyles: bp_availableStyles,
    availableLayers: bp_availableLayerss,
    savePlans,
    isBusy: isBusyPlans,
  } = useBasePlans();

  const { groupDialog, planDialog, editDialog, levelsDialog, configDialog } =
    usePlansDialogs();

  const {
    baseCode,
    baseStyle,
    baseLayers,
    ceilingCode,
    ceilingStyle,
    ceilingLayers,
    saveConfig,
    updateBaseCode,
    updateBaseStyle,
    updateBaseLayers,
    updateCeilingCode,
    updateCeilingStyle,
    updateCeilingLayers,
  } = useBasePlansConfig(
    basePlansData,
    savePlans as unknown as (
      plans: unknown,
      showToast?: boolean
    ) => Promise<void>
  );

  const [isGroupEditDialogOpen, setIsGroupEditDialogOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');

  const memoizedData = useMemo(
    () => ({ groups: data.groups, plans: [] }),
    [data.groups]
  );

  const editor = usePlanEditor(
    memoizedData,
    availableStyles,
    availableLayers,
    getCurrentState,
    currentState,
    setData as (data: unknown) => void,
    saveToJson
  );

  const groups = data.groups;

  const setGroups = (
    newGroups: PlanGroup[] | ((prev: PlanGroup[]) => PlanGroup[])
  ) => {
    const updatedGroups =
      typeof newGroups === 'function' ? newGroups(data.groups) : newGroups;

    setData({
      ...data,
      groups: updatedGroups,
    });
  };

  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => a.name.localeCompare(b.name)),
    [groups]
  );

  const handleAddGroup = async () => {
    if (!groupDialog.name.trim()) {
      toast.error('Digite um nome para o grupo');
      return;
    }

    const newGroup: PlanGroup = {
      id: Date.now().toString(),
      name: groupDialog.name.trim(),
      segments: [],
    };

    setGroups([...groups, newGroup]);
    groupDialog.reset();
    await saveToJson();
    toast.success('Grupo adicionado com sucesso!');
  };

  const handleDeleteGroup = async (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    const confirmed = await confirm({
      title: 'Remover grupo',
      description: `Deseja realmente remover o grupo "${
        group?.name
      }" e todas as suas ${(group?.segments || []).length} planta(s)?`,
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });
    if (!confirmed) return;

    setGroups(groups.filter((g) => g.id !== groupId));
    await saveToJson();
    toast.success('Grupo removido com sucesso!');
  };

  const handleEditGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    setEditingGroupId(groupId);
    setEditingGroupName(group.name);
    setIsGroupEditDialogOpen(true);
  };

  const handleConfirmEditGroup = async () => {
    if (!editingGroupId || !editingGroupName.trim()) {
      toast.error('Nome inválido');
      return;
    }

    const group = groups.find((g) => g.id === editingGroupId);
    if (!group) return;

    if (editingGroupName.trim() === group.name) {
      setIsGroupEditDialogOpen(false);
      return;
    }

    setGroups(
      groups.map((g) =>
        g.id === editingGroupId ? { ...g, name: editingGroupName.trim() } : g
      )
    );
    await saveToJson();
    toast.success('Grupo renomeado com sucesso!');
    setIsGroupEditDialogOpen(false);
    setEditingGroupId(null);
    setEditingGroupName('');
  };

  const handleAddPlan = async () => {
    if (!planDialog.title.trim()) {
      toast.error('Digite um título para a planta');
      return;
    }

    if (
      !planDialog.selectedGroup.trim() ||
      planDialog.selectedGroup === 'root'
    ) {
      toast.error('Selecione um grupo para a planta');
      return;
    }

    const newSegment = {
      id: Date.now().toString(),
      name: planDialog.title.trim(),
      code: planDialog.title.trim().toLowerCase().replace(/\s+/g, '_'),
      style: currentState?.style || 'PRO_PLANTAS',
      cameraType: currentState?.cameraType || 'topo_ortogonal',
      activeLayers: currentState?.activeLayers || [],
    };

    if (planDialog.selectedGroup === 'root') {
      const newGroup: PlanGroup = {
        id: Date.now().toString(),
        name: planDialog.title.trim(),
        segments: [newSegment],
      };
      setGroups([...groups, newGroup]);
    } else {
      setGroups(
        groups.map((group) => {
          if (group.id === planDialog.selectedGroup) {
            return {
              ...group,
              segments: [...(group.segments || []), newSegment],
            };
          }
          return group;
        })
      );
    }

    planDialog.reset();
    await saveToJson();
    toast.success('Planta adicionada com sucesso!');
  };

  const handleDeletePlan = async (groupId: string, segmentId: string) => {
    const confirmed = await confirm({
      title: 'Remover planta',
      description: 'Deseja realmente remover esta planta?',
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });
    if (!confirmed) return;

    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            segments: (group.segments || []).filter(
              (segment) => segment.id !== segmentId
            ),
          };
        }
        return group;
      })
    );
    await saveToJson();
    toast.success('Planta removida com sucesso!');
  };

  const handleDuplicatePlan = async (groupId: string, segment: Plan) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            segments: [
              ...(g.segments || []),
              {
                ...segment,
                id: Date.now().toString(),
                name: `${segment.name!} (cópia)`,
              },
            ],
          };
        }
        return g;
      })
    );
    await saveToJson();
    toast.success('Planta duplicada!');
  };

  const handleApplyPlan = async (segment: Plan) => {
    await applyPlanConfig(segment.name!, segment.code, {
      style: segment.style,
      cameraType: segment.cameraType,
      activeLayers: segment.activeLayers,
    });

    toast.success(`Planta "${segment.name}" aplicada!`);
  };

  const handleEditPlan = (plan: Plan) => {
    editor.openEditor(plan);
    editDialog.open(
      plan as unknown as {
        id: string;
        title: string;
        segments: { id: string; name: string }[];
      }
    );
  };

  const handleSaveEditPlan = async () => {
    const success = await editor.saveEdits(groups);
    if (success) {
      editDialog.close();
    }
  };

  const handleCancelEdit = () => {
    editor.closeEditor();
    editDialog.close();
  };

  const handleGroupDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddGroup();
  };

  const handlePlanDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddPlan();
  };

  const handleApplyCurrentStateBasePlans = async (
    availableLayers: string[],
    activeTab?: 'base' | 'ceiling'
  ) => {
    try {
      await getCurrentState();

      if (currentState) {
        if (activeTab === 'base') {
          updateBaseStyle(currentState.style);
          updateBaseLayers(currentState.activeLayers);
          toast.success('Estado atual aplicado à configuração de Base!');
        } else if (activeTab === 'ceiling') {
          updateCeilingStyle(currentState.style);
          updateCeilingLayers(currentState.activeLayers);
          toast.success('Estado atual aplicado à configuração de Forro!');
        }
      } else {
        toast.error('Não foi possível obter o estado atual');
      }
    } catch (error) {
      toast.error('Erro ao obter estado atual');
      console.error('Error getting current state:', error);
    }
  };

  const menuItems = [
    {
      label: 'Criar grupo',
      action: () => groupDialog.open(),
      hasDivider: false,
    },
    {
      label: 'Criar planta',
      action: () => planDialog.open(),
      hasDivider: false,
    },
    {
      label: 'Editar níveis',
      action: () => configDialog.open(),
      hasDivider: true,
    },
    {
      label: 'Restaurar padrão',
      action: () => loadDefault(),
      hasDivider: false,
    },
  ];

  return (
    <>
      <AddItemDialog
        isOpen={groupDialog.isOpen}
        onOpenChange={groupDialog.setOpen}
        title='Criar novo grupo'
        description='Organize suas plantas em grupos personalizados.'
        inputLabel='Nome do grupo'
        inputPlaceholder='Ex: Pavimento Térreo'
        inputValue={groupDialog.name}
        onInputChange={groupDialog.setName}
        onAdd={handleAddGroup}
        onKeyPress={handleGroupDialogKeyPress}
      />

      <AddItemWithGroupDialog
        groups={groups}
        isOpen={planDialog.isOpen}
        itemValue={planDialog.title}
        selectedGroup={planDialog.selectedGroup}
        title='Criar nova planta'
        description='Organize suas plantas em grupos personalizados.'
        itemLabel='Nome da planta'
        itemPlaceholder='Ex: Planta de Arquitetura'
        onAdd={handleAddPlan}
        onKeyPress={handlePlanDialogKeyPress}
        onOpenChange={planDialog.setOpen}
        onItemValueChange={planDialog.setTitle}
        onSelectedGroupChange={planDialog.setSelectedGroup}
      />

      <GroupNameEditDialog
        open={isGroupEditDialogOpen}
        onOpenChange={setIsGroupEditDialogOpen}
        groupName={editingGroupName}
        onGroupNameChange={setEditingGroupName}
        onConfirm={handleConfirmEditGroup}
        disabled={isBusy}
      />

      <ViewConfigDialog
        title='Configuração da Planta'
        style={editor.editPlanStyle}
        onSave={handleSaveEditPlan}
        isBusy={isBusy}
        isOpen={editDialog.isOpen}
        onCancel={handleCancelEdit}
        cameraType={editor.editCameraType}
        onOpenChange={editDialog.setOpen}
        activeLayers={editor.editActiveLayers}
        onStyleChange={editor.setEditPlanStyle}
        availableStyles={availableStyles}
        availableLayers={availableLayers}
        onSelectNoLayers={editor.selectNoLayers}
        onSelectAllLayers={editor.selectAllLayers}
        onCameraTypeChange={editor.setEditCameraType}
        onApplyCurrentState={editor.applyCurrentState}
        onActiveLayersChange={editor.setEditActiveLayers}
        itemTitle={editor.editPlanName}
        itemCode={editor.editPlanCode}
        onItemTitleChange={editor.setEditPlanName}
        onItemCodeChange={editor.setEditPlanCode}
        allowedCameraTypes={[
          'topo_perspectiva',
          'topo_ortogonal',
          'iso_invertida_perspectiva',
          'iso_invertida_ortogonal',
        ]}
      />

      <ViewConfigDialog
        mode='multi-tab'
        title='Configurações Base e Forro'
        description='Configure os estilos e camadas que serão usados nas plantas de base e forro'
        isOpen={configDialog.isOpen}
        isBusy={isBusy || isBusyPlans}
        onSave={() => saveConfig(true)}
        onOpenChange={configDialog.setOpen}
        availableStyles={bp_availableStyles}
        availableLayers={bp_availableLayerss}
        onApplyCurrentState={handleApplyCurrentStateBasePlans}
        baseConfig={{
          code: baseCode,
          style: baseStyle,
          layers: baseLayers,
          updateCode: updateBaseCode,
          updateStyle: updateBaseStyle,
          updateLayers: updateBaseLayers,
        }}
        ceilingConfig={{
          code: ceilingCode,
          style: ceilingStyle,
          layers: ceilingLayers,
          updateCode: updateCeilingCode,
          updateStyle: updateCeilingStyle,
          updateLayers: updateCeilingLayers,
        }}
      />

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            Plantas {isLoading && <Loader2 className='w-4 h-4 animate-spin' />}
          </h2>
          <div className='flex items-center gap-2'>
            <ViewConfigMenu menuItems={menuItems} />
          </div>
        </div>

        <div className='flex flex-col gap-3 w-full'>
          <Button
            size='sm'
            className='w-full flex items-center gap-3 justify-center'
            variant='default'
            onClick={levelsDialog.open}
          >
            <Plus className='w-5 h-5' />
            <span>Gerenciar Níveis</span>
          </Button>
        </div>

        <LevelsManagerDialog
          isOpen={levelsDialog.isOpen}
          onOpenChange={levelsDialog.setOpen}
        />

        {isLoading && sortedGroups.length === 0 && <ScenesLoadingState />}

        {isLoading && sortedGroups.length > 0 && <ScenesSkeleton />}

        {!isLoading && sortedGroups.length === 0 && <ScenesEmptyState />}

        {!isLoading && sortedGroups.length > 0 && (
          <GroupAccordion
            groups={sortedGroups}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
            emptyMessage='Nenhuma planta neste grupo'
            iconPosition='right'
            renderSegment={(segment, groupId) => (
              <PlanItem
                key={segment.id}
                title={segment.name}
                onEdit={() => handleEditPlan(segment as unknown as Plan)}
                onLoadFromJson={() =>
                  handleApplyPlan(segment as unknown as Plan)
                }
                onDuplicate={() =>
                  handleDuplicatePlan(groupId, segment as unknown as Plan)
                }
                onDelete={() => handleDeletePlan(groupId, segment.id)}
              />
            )}
          />
        )}
      </div>

      <ConfirmDialog />
    </>
  );
}

export default React.memo(PlansComponent);
