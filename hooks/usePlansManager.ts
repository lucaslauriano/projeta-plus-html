'use client';

import { useMemo } from 'react';
import { usePlans } from './usePlans';
import { useBasePlans } from './useBasePlans';
import { usePlansActions } from './usePlansActions';
import { useConfirm } from './useConfirm';
import { PlansService } from '@/services/plans.service';
import type {
  PlansManagerState,
  PlansActions,
  PlansData,
  Plan,
} from '@/types/plans.types';

/**
 * Hook principal para gerenciamento de plantas
 * Consolida todos os hooks e fornece interface unificada
 */
export function usePlansManager(): PlansManagerState & PlansActions {
  const { confirm } = useConfirm();

  // Dados principais de plantas
  const {
    data,
    setData,
    isBusy: isBusyPlans,
    isLoading,
    currentState,
    availableStyles,
    availableLayers,
    saveToJson,
    loadDefault,
    getCurrentState,
    applyPlanConfig,
  } = usePlans();

  // Dados de configuração base (base e forro)
  const { data: basePlansData, isBusy: isBusyBase } = useBasePlans();

  // Wrapper para setData com tipagem compatível
  const setPlansData = (
    updater: PlansData | ((prev: PlansData) => PlansData)
  ) => {
    if (typeof updater === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setData((prev) => updater(prev as PlansData) as any);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setData(updater as any);
    }
  };

  // Ações consolidadas
  const actions = usePlansActions({
    data: data as PlansData,
    setData: setPlansData,
    saveToJson,
    applyPlanConfig: applyPlanConfig as (
      name: string,
      code: string | undefined,
      config: Partial<Plan>
    ) => Promise<void>,
    confirm,
  });

  // Estado derivado memoizado
  const sortedGroups = useMemo(
    () => PlansService.sortGroups(data.groups),
    [data.groups]
  );

  const isBusy = isBusyPlans || isBusyBase;

  return {
    // Estado
    groups: data.groups,
    sortedGroups,
    isBusy,
    isLoading,
    currentState,
    availableStyles,
    availableLayers,
    basePlansData,

    // Ações de grupos
    addGroup: actions.addGroup,
    deleteGroup: actions.deleteGroup,
    updateGroup: actions.updateGroup,

    // Ações de plantas
    addPlan: actions.addPlan,
    deletePlan: actions.deletePlan,
    duplicatePlan: actions.duplicatePlan,
    updatePlan: actions.updatePlan,
    applyPlan: actions.applyPlan,

    // Métodos auxiliares
    getCurrentState,
    loadDefault,
  };
}
