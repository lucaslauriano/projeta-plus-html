'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { PlansService } from '@/services/plans.service';
import type { PlansData, Plan, PlansActions } from '@/types/plans.types';

interface UsePlansActionsParams {
  data: PlansData;
  setData: (data: PlansData | ((prev: PlansData) => PlansData)) => void;
  saveToJson: (dataToSave?: unknown) => Promise<void>;
  applyPlanConfig: (
    name: string,
    code: string | undefined,
    config: Partial<Plan>
  ) => Promise<void>;
  confirm: (options: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
  }) => Promise<boolean>;
}

/**
 * Hook para gerenciar ações de plantas
 * Encapsula toda a lógica de CRUD e orquestração com o PlansService
 */
export function usePlansActions({
  data,
  setData,
  saveToJson,
  applyPlanConfig,
  confirm,
}: UsePlansActionsParams): PlansActions {
  /**
   * Utilitário para atualizar dados e salvar
   */
  const updateAndSave = useCallback(
    async (updater: (current: PlansData) => PlansData) => {
      const updated = updater(data);
      setData(updated);
      await saveToJson(updated);
    },
    [data, setData, saveToJson]
  );

  // ========================================
  // GRUPOS
  // ========================================

  const addGroup = useCallback(
    async (name: string) => {
      if (!name.trim()) {
        toast.error('Digite um nome para o grupo');
        return false;
      }

      await updateAndSave((current) => ({
        ...current,
        groups: PlansService.addGroup(current.groups, name),
      }));

      toast.success('Grupo adicionado com sucesso!');
      return true;
    },
    [updateAndSave]
  );

  const deleteGroup = useCallback(
    async (groupId: string) => {
      const group = PlansService.findGroup(data.groups, groupId);
      const confirmed = await confirm({
        title: 'Remover grupo',
        description: `Deseja realmente remover o grupo "${
          group?.name
        }" e todas as suas ${(group?.segments || []).length} planta(s)?`,
        confirmText: 'Remover',
        cancelText: 'Cancelar',
        variant: 'destructive',
      });

      if (!confirmed) return false;

      await updateAndSave((current) => ({
        ...current,
        groups: PlansService.deleteGroup(current.groups, groupId),
      }));

      toast.success('Grupo removido com sucesso!');
      return true;
    },
    [data.groups, updateAndSave, confirm]
  );

  const updateGroup = useCallback(
    async (groupId: string, name: string) => {
      if (!name.trim()) {
        toast.error('Nome inválido');
        return false;
      }

      const group = PlansService.findGroup(data.groups, groupId);
      if (!group) return false;

      if (name.trim() === group.name) {
        return true; // Sem mudanças
      }

      await updateAndSave((current) => ({
        ...current,
        groups: PlansService.updateGroup(current.groups, groupId, name),
      }));

      toast.success('Grupo renomeado com sucesso!');
      return true;
    },
    [data.groups, updateAndSave]
  );

  // ========================================
  // PLANTAS
  // ========================================

  const addPlan = useCallback(
    async (groupId: string, plan: Omit<Plan, 'id'>) => {
      if (!plan.name.trim()) {
        toast.error('Digite um nome para a planta');
        return false;
      }

      if (!groupId || groupId === 'root') {
        toast.error('Selecione um grupo para a planta');
        return false;
      }

      await updateAndSave((current) => ({
        ...current,
        groups: PlansService.addPlan(current.groups, groupId, plan),
      }));

      toast.success('Planta adicionada com sucesso!');
      return true;
    },
    [updateAndSave]
  );

  const deletePlan = useCallback(
    async (groupId: string, planId: string) => {
      const confirmed = await confirm({
        title: 'Remover planta',
        description: 'Deseja realmente remover esta planta?',
        confirmText: 'Remover',
        cancelText: 'Cancelar',
        variant: 'destructive',
      });

      if (!confirmed) return false;

      await updateAndSave((current) => ({
        ...current,
        groups: PlansService.deletePlan(current.groups, groupId, planId),
      }));

      toast.success('Planta removida com sucesso!');
      return true;
    },
    [updateAndSave, confirm]
  );

  const duplicatePlan = useCallback(
    async (groupId: string, plan: Plan) => {
      await updateAndSave((current) => ({
        ...current,
        groups: PlansService.duplicatePlan(current.groups, groupId, plan),
      }));

      toast.success('Planta duplicada!');
      return true;
    },
    [updateAndSave]
  );

  const updatePlan = useCallback(
    async (groupId: string, planId: string, updates: Partial<Plan>) => {
      if (updates.name !== undefined && !updates.name.trim()) {
        toast.error('Digite um nome para a planta');
        return false;
      }

      await updateAndSave((current) => ({
        ...current,
        groups: PlansService.updatePlan(
          current.groups,
          groupId,
          planId,
          updates
        ),
      }));

      toast.success('Configuração salva no JSON!');
      return true;
    },
    [updateAndSave]
  );

  const applyPlan = useCallback(
    async (plan: Plan) => {
      await applyPlanConfig(plan.name, plan.code, {
        style: plan.style,
        cameraType: plan.cameraType,
        activeLayers: plan.activeLayers,
      });

      toast.success(`Planta "${plan.name}" aplicada!`);
    },
    [applyPlanConfig]
  );

  // ========================================
  // AUXILIARES (pass-through)
  // ========================================

  const getCurrentState = useCallback(async () => {
    // Este método será fornecido pelo usePlansManager
    // Aqui apenas definimos a interface
  }, []);

  const loadDefault = useCallback(async () => {
    // Este método será fornecido pelo usePlansManager
    // Aqui apenas definimos a interface
  }, []);

  return {
    addGroup,
    deleteGroup,
    updateGroup,
    addPlan,
    deletePlan,
    duplicatePlan,
    updatePlan,
    applyPlan,
    getCurrentState,
    loadDefault,
  };
}
