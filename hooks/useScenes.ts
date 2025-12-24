'use client';

import { useViewConfigs, ViewConfig } from './useViewConfigs';
import type { ViewConfigGroup, ViewConfigSegment } from '@/types/global';

export type Scene = ViewConfig;

export type SceneSegment = ViewConfigSegment;

export type SceneGroup = ViewConfigGroup;

export interface ScenesData {
  groups: SceneGroup[];
  scenes?: Scene[]; // Deprecated, for backward compatibility
}

export interface CurrentState {
  style: string;
  cameraType: string;
  activeLayers: string[];
}

export function useScenes() {
  const result = useViewConfigs({
    entityName: 'scenes',
    entityNameSingular: 'scene',
    rubyMethods: {
      get: 'getScenes',
      add: 'addScene',
      update: 'updateScene',
      delete: 'deleteScene',
      applyConfig: 'applySceneConfig',
      saveToJson: 'saveScenesToJson',
      loadFromJson: 'loadScenesFromJson',
      loadDefault: 'loadDefaultScenes',
      loadFromFile: 'loadScenesFromFile',
      getAvailableStyles: 'getAvailableStyles',
      getAvailableLayers: 'getAvailableLayers',
      getVisibleLayers: 'getVisibleLayers',
      getCurrentState: 'getCurrentState',
    },
    handlers: {
      get: 'handleGetScenesResult',
      add: 'handleAddSceneResult',
      update: 'handleUpdateSceneResult',
      delete: 'handleDeleteSceneResult',
      applyConfig: 'handleApplySceneConfigResult',
      saveToJson: 'handleSaveScenesToJsonResult',
      loadFromJson: 'handleLoadScenesFromJsonResult',
      loadDefault: 'handleLoadDefaultScenesResult',
      loadFromFile: 'handleLoadScenesFromFileResult',
      getAvailableStyles: 'handleGetAvailableStylesResult',
      getAvailableLayers: 'handleGetAvailableLayersResult',
      getVisibleLayers: 'handleGetVisibleLayersResult',
      getCurrentState: 'handleGetCurrentStateResult',
    },
    mockData: [
      {
        id: 'geral',
        name: 'Geral',
        style: 'FM_VISTAS',
        cameraType: 'iso_perspectiva',
        activeLayers: ['Layer0'],
      },
    ],
  });

  return {
    data: result.data as unknown as ScenesData,
    isBusy: result.isBusy,
    isLoading: result.isLoading,
    isAvailable: result.isAvailable,
    currentState: result.currentState,
    availableStyles: result.availableStyles,
    availableLayers: result.availableLayers,
    setData: result.setData,
    clearAll: result.clearAll,
    addScene: result.addItem,
    getScenes: result.getItems,
    saveToJson: result.saveToJson,
    updateScene: result.updateItem,
    loadDefault: result.loadDefault,
    deleteScene: result.deleteItem,
    loadFromJson: result.loadFromJson,
    loadFromFile: result.loadFromFile,
    getCurrentState: result.getCurrentState,
    applySceneConfig: result.applyConfig,
    getAvailableStyles: result.getAvailableStyles,
    getAvailableLayers: result.getAvailableLayers,
  };
}
