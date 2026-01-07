'use client';

import { useViewConfigs, ViewConfig } from './useViewConfigs';
import type { ViewConfigGroup, ViewConfigSegment } from '@/types/global';

export type Plan = ViewConfig;

export type PlanSegment = ViewConfigSegment;

export type PlanGroup = ViewConfigGroup;

export interface PlansData {
  groups: PlanGroup[];
  plans?: Plan[]; // Deprecated, for backward compatibility
}

export interface CurrentState {
  style: string;
  cameraType: string;
  activeLayers: string[];
}

export function usePlans() {
  const result = useViewConfigs({
    entityName: 'plans',
    entityNameSingular: 'plan',
    rubyMethods: {
      get: 'getPlans',
      add: 'addPlan',
      update: 'updatePlan',
      delete: 'deletePlan',
      applyConfig: 'applyPlanConfig',
      saveToJson: 'savePlansToJson',
      loadFromJson: 'loadPlansFromJson',
      loadDefault: 'loadDefaultPlans',
      loadFromFile: 'loadPlansFromFile',
      getAvailableStyles: 'getAvailableStylesPlans',
      getAvailableLayers: 'getAvailableLayersPlans',
      getVisibleLayers: 'getVisibleLayersPlans',
      getCurrentState: 'getCurrentStatePlans',
    },
    handlers: {
      get: 'handleGetPlansResult',
      add: 'handleAddPlanResult',
      update: 'handleUpdatePlanResult',
      delete: 'handleDeletePlanResult',
      applyConfig: 'handleApplyPlanConfigResult',
      saveToJson: 'handleSavePlansToJsonResult',
      loadFromJson: 'handleLoadPlansFromJsonResult',
      loadDefault: 'handleLoadDefaultPlansResult',
      loadFromFile: 'handleLoadPlansFromFileResult',
      getAvailableStyles: 'handleGetAvailableStylesPlansResult',
      getAvailableLayers: 'handleGetAvailableLayersPlansResult',
      getVisibleLayers: 'handleGetVisibleLayersPlansResult',
      getCurrentState: 'handleGetCurrentStatePlansResult',
    },
    mockData: [
      {
        id: 'planta_baixa',
        name: 'Planta Baixa',
        style: 'PRO_PLANTAS',
        cameraType: 'topo_ortogonal',
        activeLayers: ['Layer0'],
      },
    ],
  });

  return {
    data: result.data as unknown as PlansData,
    isBusy: result.isBusy,
    isLoading: result.isLoading,
    isAvailable: result.isAvailable,
    currentState: result.currentState,
    availableStyles: result.availableStyles,
    availableLayers: result.availableLayers,
    setData: result.setData,
    clearAll: result.clearAll,
    addPlan: result.addItem,
    getPlans: result.getItems,
    saveToJson: result.saveToJson,
    updatePlan: result.updateItem,
    loadDefault: result.loadDefault,
    deletePlan: result.deleteItem,
    loadFromJson: result.loadFromJson,
    loadFromFile: result.loadFromFile,
    getCurrentState: result.getCurrentState,
    applyPlanConfig: result.applyConfig,
    getAvailableStyles: result.getAvailableStyles,
    getAvailableLayers: result.getAvailableLayers,
  };
}
