/**
 * Types centralizados para o módulo de Plantas
 * Importa e re-exporta tipos base do useViewConfigs para compatibilidade
 */

import type {
  ViewConfig,
  ViewConfigGroup,
  ViewConfigsData,
  CurrentState as ViewConfigCurrentState,
} from '@/hooks/useViewConfigs';
import type {
  BasePlan,
  BasePlansData as UseBasePlansData,
} from '@/hooks/useBasePlans';

// Estender tipos base para uso no módulo
export interface Plan extends ViewConfig {
  code?: string;
}

export interface PlanGroup extends ViewConfigGroup {
  segments: Plan[];
}

export interface PlansData extends ViewConfigsData {
  groups: PlanGroup[];
}

export type CurrentState = ViewConfigCurrentState;
export type BasePlanConfig = BasePlan;
export type BasePlansData = UseBasePlansData;

export interface PlansManagerState {
  groups: PlanGroup[];
  sortedGroups: PlanGroup[];
  isBusy: boolean;
  isLoading: boolean;
  currentState: CurrentState | null;
  availableStyles: string[];
  availableLayers: string[];
  basePlansData: BasePlansData;
}

export interface PlansActions {
  // Grupos
  addGroup: (name: string) => Promise<boolean>;
  deleteGroup: (groupId: string) => Promise<boolean>;
  updateGroup: (groupId: string, name: string) => Promise<boolean>;

  // Plantas
  addPlan: (groupId: string, plan: Omit<Plan, 'id'>) => Promise<boolean>;
  deletePlan: (groupId: string, planId: string) => Promise<boolean>;
  duplicatePlan: (groupId: string, plan: Plan) => Promise<boolean>;
  updatePlan: (
    groupId: string,
    planId: string,
    updates: Partial<Plan>
  ) => Promise<boolean>;
  applyPlan: (plan: Plan) => Promise<void>;

  // Auxiliares
  getCurrentState: () => Promise<void>;
  loadDefault: () => Promise<void>;
}
