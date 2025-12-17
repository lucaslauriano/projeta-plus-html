'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PlanItem } from '@/components/PlanItem';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Edit, Trash2, Folder, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePlans, PlanGroup } from '@/hooks/usePlans';
import {
  AddGroupDialog,
  AddSceneDialog,
} from '@/app/dashboard/inteli-sket/components/scene-group-dialogs';
import {
  ScenesSkeleton,
  ScenesEmptyState,
  ScenesLoadingState,
} from '@/app/dashboard/inteli-sket/components/scenes-skeleton';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';
import { LevelsManagerDialog } from '@/app/dashboard/inteli-sket/components/levels-manager-dialog';
import { Button } from '@/components/ui/button';
import { ViewConfigEditDialog } from '@/app/dashboard/inteli-sket/components/view-config-edit-dialog';
import { BasePlansConfigDialog } from '@/app/dashboard/inteli-sket/components/base-plans-config-dialog';
import { useBasePlans } from '@/hooks/useBasePlans';

interface Segment {
  id: string;
  name: string;
}

interface Plan {
  id: string;
  title: string;
  segments: Segment[];
}

function PlansComponent() {
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
    loadFromFile,
    loadFromJson,
    getCurrentState,
    applyPlanConfig,
  } = usePlans();

  const {
    data: basePlansData,
    availableStyles: bp_availableStyles,
    availableLayers: bp_availableLayerss,
    savePlans,
    isBusy: isBusyPlans,
  } = useBasePlans();

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

  const [newGroupName, setNewGroupName] = useState('');
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('root');
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLevelsDialogOpen, setIsLevelsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanStyle, setEditPlanStyle] = useState('');
  const [editCameraType, setEditCameraType] = useState('');
  const [editActiveLayers, setEditActiveLayers] = useState<string[]>([]);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [baseStyle, setBaseStyle] = useState('FM_VISTAS');
  const [baseLayers, setBaseLayers] = useState<string[]>(['Layer0']);
  const [ceilingStyle, setCeilingStyle] = useState('FM_VISTAS');
  const [ceilingLayers, setCeilingLayers] = useState<string[]>(['Layer0']);
  const [isInitialized, setIsInitialized] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => a.name.localeCompare(b.name)),
    [groups]
  );

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Digite um nome para o grupo');
      return;
    }

    const newGroup: PlanGroup = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      plans: [],
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    setNewGroupName('');
    setIsGroupDialogOpen(false);

    await saveToJson();

    toast.success('Grupo adicionado com sucesso!');
  };

  const handleAddPlan = async () => {
    if (!newPlanTitle.trim()) {
      toast.error('Digite um título para a planta');
      return;
    }

    const newPlan: Plan = {
      id: Date.now().toString(),
      title: newPlanTitle.trim(),
      segments: [],
    };

    let updatedGroups: PlanGroup[];
    if (selectedGroup === 'root') {
      const newGroup: PlanGroup = {
        id: Date.now().toString(),
        name: newPlanTitle.trim(),
        plans: [],
      };
      updatedGroups = [...groups, newGroup];
      setGroups(updatedGroups);
    } else {
      updatedGroups = groups.map((group) => {
        if (group.id === selectedGroup) {
          return {
            ...group,
            plans: [...group.plans, newPlan],
          };
        }
        return group;
      });
      setGroups(updatedGroups);
    }

    setNewPlanTitle('');
    setIsPlanDialogOpen(false);

    await saveToJson();

    toast.success('Planta adicionada com sucesso!');
  };

  const handleDeleteGroup = async (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    const confirmed = confirm(
      `Deseja realmente remover o grupo "${group?.name}" e todas as suas ${
        group?.plans.length || 0
      } planta(s)?`
    );
    if (!confirmed) return;

    setGroups(groups.filter((group) => group.id !== groupId));

    await saveToJson();

    toast.success('Grupo removido com sucesso!');
  };

  const handleEditGroup = async (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    const newName = prompt('Digite o novo nome do grupo:', group.name);
    if (!newName || newName.trim() === '') {
      toast.error('Nome inválido');
      return;
    }

    if (newName.trim() === group.name) {
      return; // Nenhuma mudança
    }

    setGroups(
      groups.map((g) => (g.id === groupId ? { ...g, name: newName.trim() } : g))
    );

    await saveToJson();

    toast.success('Grupo renomeado com sucesso!');
  };

  const handleDeletePlan = async (groupId: string, planId: string) => {
    const confirmed = confirm('Deseja realmente remover esta planta?');
    if (!confirmed) return;

    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            plans: group.plans.filter((plan) => plan.id !== planId),
          };
        }
        return group;
      })
    );

    await saveToJson();

    toast.success('Planta removida com sucesso!');
  };

  const handleDuplicatePlan = async (groupId: string, plan: Plan) => {
    setGroups(
      groups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            plans: [
              ...g.plans,
              {
                id: Date.now().toString(),
                title: `${plan.title} (cópia)`,
                segments: [...plan.segments],
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

  const handleGroupDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGroup();
    }
  };

  const handlePlanDialogKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlan();
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setEditPlanName(plan.title);

    const planConfig = data.plans.find(
      (p) => p.id === plan.id || p.name === plan.title
    );

    if (planConfig) {
      setEditPlanStyle(planConfig.style || availableStyles[0] || 'FM_PLANTAS');
      setEditCameraType(planConfig.cameraType || 'topo_ortogonal');
      setEditActiveLayers(planConfig.activeLayers || ['Layer0']);
    } else {
      setEditPlanStyle(availableStyles[0] || 'FM_PLANTAS');
      setEditCameraType('topo_ortogonal');
      setEditActiveLayers(['Layer0']);
    }

    setIsEditDialogOpen(true);
  };

  const handleApplyCurrentState = async () => {
    await getCurrentState();
    if (currentState) {
      setEditPlanStyle(currentState.style);
      setEditCameraType(currentState.cameraType);
      setEditActiveLayers(currentState.activeLayers);
      toast.success('Estado atual aplicado!');
    }
  };

  const handleSelectAllLayers = () => {
    setEditActiveLayers(availableLayers);
  };

  const handleSelectNoLayers = () => {
    setEditActiveLayers([]);
  };

  const handleSaveEditPlan = async () => {
    if (!editPlanName.trim() || !editingPlan) {
      toast.error('Digite um nome para a planta');
      return;
    }

    const updatedPlans = data.plans.map((p) => {
      if (p.id === editingPlan.id || p.name === editingPlan.title) {
        return {
          ...p,
          name: editPlanName.trim(),
          style: editPlanStyle,
          cameraType: editCameraType,
          activeLayers: editActiveLayers,
        };
      }
      return p;
    });

    const planExists = data.plans.some(
      (p) => p.id === editingPlan.id || p.name === editingPlan.title
    );

    if (!planExists) {
      updatedPlans.push({
        id: editingPlan.id,
        name: editPlanName.trim(),
        style: editPlanStyle,
        cameraType: editCameraType,
        activeLayers: editActiveLayers,
      });
    }

    const updatedGroups = groups.map((g) => ({
      ...g,
      plans: g.plans.map((p) =>
        p.id === editingPlan.id ? { ...p, title: editPlanName.trim() } : p
      ),
    }));

    setData({
      groups: updatedGroups,
      plans: updatedPlans,
    });

    await saveToJson();

    setIsEditDialogOpen(false);
    setEditingPlan(null);
    toast.success('Configuração salva no JSON!');
  };

  const handleApplyPlan = async (plan: Plan) => {
    const planConfig = data.plans.find(
      (p) => p.id === plan.id || p.name === plan.title
    );

    if (!planConfig) {
      toast.error('Configuração da planta não encontrada no JSON');
      return;
    }

    await applyPlanConfig(plan.title, {
      style: planConfig.style,
      cameraType: planConfig.cameraType,
      activeLayers: planConfig.activeLayers,
    });

    toast.success(`Planta "${plan.title}" aplicada!`);
  };

  // Funções baseplans config dialog
  const handleBaseStyleChange = (style: string) => {
    setBaseStyle(style);
  };

  const handleBaseLayersChange = (layers: string[]) => {
    setBaseLayers(layers);
  };

  const handleCeilingStyleChange = (style: string) => {
    setCeilingStyle(style);
  };

  const handleCeilingLayersChange = (layers: string[]) => {
    setCeilingLayers(layers);
  };

  const handleBasePlansApplyCurrentState = () => {
    // TODO: Implementar lógica para aplicar o estado atual do modelo
    toast.info('Aplicando estado atual...');
  };

  const saveConfig = async (showToast: boolean = false) => {
    const plans = [
      {
        id: 'base',
        name: 'Base',
        style: baseStyle,
        activeLayers: baseLayers,
      },
      {
        id: 'forro',
        name: 'Forro',
        style: ceilingStyle,
        activeLayers: ceilingLayers,
      },
    ];

    await savePlans(plans, showToast);
  };
  useEffect(() => {
    if (!isInitialized) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const plans = [
        {
          id: 'base',
          name: 'Base',
          style: baseStyle,
          activeLayers: baseLayers,
        },
        {
          id: 'forro',
          name: 'Forro',
          style: ceilingStyle,
          activeLayers: ceilingLayers,
        },
      ];

      savePlans(plans, false);
    }, 100);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    baseStyle,
    baseLayers,
    ceilingStyle,
    ceilingLayers,
    isInitialized,
    savePlans,
  ]);

  useEffect(() => {
    if (basePlansData.plans.length > 0 && !isInitialized) {
      const basePlan = basePlansData.plans.find((p) => p.id === 'base');
      const ceilingPlan = basePlansData.plans.find((p) => p.id === 'forro');

      if (basePlan) {
        setBaseStyle(basePlan.style);
        setBaseLayers(basePlan.activeLayers);
      }
      if (ceilingPlan) {
        setCeilingStyle(ceilingPlan.style);
        setCeilingLayers(ceilingPlan.activeLayers);
      }

      setIsInitialized(true);
    }
  }, [basePlansData, isInitialized]);

  return (
    <>
      <AddGroupDialog
        onAdd={handleAddGroup}
        isOpen={isGroupDialogOpen}
        groupName={newGroupName}
        onKeyPress={handleGroupDialogKeyPress}
        onOpenChange={setIsGroupDialogOpen}
        onGroupNameChange={setNewGroupName}
      />

      <AddSceneDialog
        onAdd={handleAddPlan}
        groups={groups}
        isOpen={isPlanDialogOpen}
        onKeyPress={handlePlanDialogKeyPress}
        sceneTitle={newPlanTitle}
        onOpenChange={setIsPlanDialogOpen}
        selectedGroup={selectedGroup}
        onSceneTitleChange={setNewPlanTitle}
        onSelectedGroupChange={setSelectedGroup}
      />

      <ViewConfigEditDialog
        title='Configuração da Planta'
        style={editPlanStyle}
        onSave={handleSaveEditPlan}
        isBusy={isBusy}
        isOpen={isEditDialogOpen}
        onCancel={() => {
          setEditingPlan(null);
          setIsEditDialogOpen(false);
        }}
        cameraType={editCameraType}
        onOpenChange={setIsEditDialogOpen}
        activeLayers={editActiveLayers}
        onStyleChange={setEditPlanStyle}
        availableStyles={availableStyles}
        availableLayers={availableLayers}
        onSelectNoLayers={handleSelectNoLayers}
        onSelectAllLayers={handleSelectAllLayers}
        onCameraTypeChange={setEditCameraType}
        onApplyCurrentState={handleApplyCurrentState}
        onActiveLayersChange={setEditActiveLayers}
        itemTitle={editPlanName}
        onItemTitleChange={setEditPlanName}
        allowedCameraTypes={[
          'topo_perspectiva',
          'topo_ortogonal',
          'iso_invertida_perspectiva',
          'iso_invertida_ortogonal',
        ]}
      />

      <BasePlansConfigDialog
        onSave={saveConfig}
        isOpen={isConfigDialogOpen}
        isBusy={isBusy || isBusyPlans}
        baseStyle={baseStyle}
        baseLayers={baseLayers}
        onOpenChange={setIsConfigDialogOpen}
        ceilingStyle={ceilingStyle}
        ceilingLayers={ceilingLayers}
        availableStyles={bp_availableStyles}
        availableLayers={bp_availableLayerss}
        onBaseStyleChange={handleBaseStyleChange}
        onBaseLayersChange={handleBaseLayersChange}
        onCeilingStyleChange={handleCeilingStyleChange}
        onCeilingLayersChange={handleCeilingLayersChange}
        onApplyCurrentState={handleBasePlansApplyCurrentState}
      />

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            Plantas {isLoading && <Loader2 className='w-4 h-4 animate-spin' />}
          </h2>
          <div className='flex items-center gap-2'>
            <ViewConfigMenu
              isBusy={isBusy}
              onAddItem={() => setIsPlanDialogOpen(true)}
              onAddGroup={() => setIsGroupDialogOpen(true)}
              onEdit={() => setIsConfigDialogOpen(true)}
              entityLabel='Planta'
              onSaveToJson={saveToJson}
              onLoadDefault={loadDefault}
              onLoadFromJson={loadFromJson}
              onLoadFromFile={loadFromFile}
            />
          </div>
        </div>

        <div className='flex flex-col gap-3 w-full'>
          <Button
            size='sm'
            className='w-full flex items-center gap-3 justify-center'
            variant='default'
            onClick={() => setIsLevelsDialogOpen(true)}
          >
            <Plus className='w-5 h-5' />
            <span>Gerenciar Níveis</span>
          </Button>
        </div>

        <LevelsManagerDialog
          isOpen={isLevelsDialogOpen}
          onOpenChange={setIsLevelsDialogOpen}
        />

        {isLoading && sortedGroups.length === 0 && <ScenesLoadingState />}

        {isLoading && sortedGroups.length > 0 && <ScenesSkeleton />}

        {!isLoading && sortedGroups.length === 0 && <ScenesEmptyState />}

        {!isLoading && sortedGroups.length > 0 && (
          <Accordion type='single' collapsible className='w-full space-y-2'>
            {sortedGroups.map((group) => (
              <AccordionItem
                key={group.id}
                value={group.id}
                className='border rounded-xl overflow-hidden bg-muted/20 px-0'
              >
                <AccordionTrigger className='px-4 py-2 hover:no-underline bg-muted/50 data-[state=open]:bg-muted/70 group data-[state=open]:rounded-bl-none data-[state=open]:rounded-br-none'>
                  <div className='flex items-center justify-between w-full pr-2'>
                    <div className='flex items-center gap-2 font-medium text-sm'>
                      <Folder className='w-4 h-4 text-muted-foreground' />
                      {group.name}
                    </div>
                    <div className='flex  items-center justify-end gap-2 text-muted-foreground'>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGroup(group.id);
                        }}
                        className='opacity-0 group-hover:opacity-100 transition-opacity'
                        title='Editar'
                      >
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group.id);
                        }}
                        className='opacity-0 group-hover:opacity-100 transition-opacity'
                        title='Excluir pasta'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='p-4'>
                  <div className='space-y-3'>
                    {group.plans.length > 0 ? (
                      <div className='space-y-2'>
                        {group.plans.map((plan) => (
                          <PlanItem
                            key={plan.id}
                            title={plan.title}
                            onEdit={() => handleEditPlan(plan as Plan)}
                            onLoadFromJson={() => handleApplyPlan(plan as Plan)}
                            onDuplicate={() =>
                              handleDuplicatePlan(group.id, plan as Plan)
                            }
                            onDelete={() => handleDeletePlan(group.id, plan.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-4 text-sm text-muted-foreground italic'>
                        Nenhuma planta neste grupo
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </>
  );
}

export default React.memo(PlansComponent);
