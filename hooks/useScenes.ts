'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSketchup } from '@/contexts/SketchupContext';
import { Segment } from 'next/dist/server/app-render/types';

export interface Scene {
  id: string;
  name: string;
  style: string;
  cameraType: string;
  activeLayers: string[];
}

export interface SceneGroup {
  id: string;
  name: string;
  scenes: Array<{
    id: string;
    title: string;
    segments: Segment[];
  }>;
}

export interface ScenesData {
  groups: SceneGroup[];
  scenes: Scene[];
}

export interface CurrentState {
  style: string;
  cameraType: string;
  activeLayers: string[];
}

export function useScenes() {
  const { callSketchupMethod, isAvailable } = useSketchup();
  const [data, setData] = useState<ScenesData>({ groups: [], scenes: [] });
  const [availableStyles, setAvailableStyles] = useState<string[]>([]);
  const [availableLayers, setAvailableLayers] = useState<string[]>([]);
  const [currentState, setCurrentState] = useState<CurrentState | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearPending = useCallback(() => {
    setPendingAction(null);
  }, []);

  // ========================================
  // HANDLERS (recebem respostas do Ruby)
  // ========================================

  useEffect(() => {
    window.handleGetScenesResult = (result: {
      success: boolean;
      message?: string;
      scenes?: Scene[];
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.scenes) {
        setData((prev) => ({
          ...prev,
          scenes: result.scenes || [],
        }));
        setIsLoading(false);
      } else {
        toast.error(result.message || 'Erro ao carregar cenas');
        setIsLoading(false);
      }
    };

    window.handleAddSceneResult = (result: {
      success: boolean;
      message: string;
      scene?: Scene;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
        // Reload scenes
        if (isAvailable) {
          callSketchupMethod('getScenes').catch(() => {});
        }
      } else {
        toast.error(result.message);
      }
    };

    window.handleUpdateSceneResult = (result: {
      success: boolean;
      message: string;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
        // Reload scenes
        if (isAvailable) {
          callSketchupMethod('getScenes').catch(() => {});
        }
      } else {
        toast.error(result.message);
      }
    };

    window.handleDeleteSceneResult = (result: {
      success: boolean;
      message: string;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
        // Reload scenes
        if (isAvailable) {
          callSketchupMethod('getScenes').catch(() => {});
        }
      } else {
        toast.error(result.message);
      }
    };

    window.handleApplySceneConfigResult = (result: {
      success: boolean;
      message: string;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };

    window.handleSaveScenesToJsonResult = (result: {
      success: boolean;
      message: string;
      path?: string;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };

    window.handleLoadScenesFromJsonResult = (result: {
      success: boolean;
      message: string;
      data?: ScenesData;
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.data) {
        setData(result.data);
        // Não mostrar toast no carregamento inicial
        if (pendingAction === 'loadJson') {
          // Silencioso na inicialização
        } else {
          toast.success(result.message);
        }
      } else {
        // Se não houver dados salvos, carregar do SketchUp
        if (!result.success) {
          getScenes();
        }
      }
    };

    window.handleLoadDefaultScenesResult = (result: {
      success: boolean;
      message: string;
      data?: ScenesData;
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.data) {
        setData(result.data);
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Erro ao carregar dados padrão');
      }
    };

    window.handleLoadScenesFromFileResult = (result: {
      success: boolean;
      message: string;
      data?: ScenesData;
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.data) {
        setData(result.data);
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Erro ao carregar arquivo');
      }
    };

    window.handleGetAvailableStylesResult = (result: {
      success: boolean;
      message?: string;
      styles?: string[];
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.styles) {
        setAvailableStyles(result.styles);
      } else {
        toast.error(result.message || 'Erro ao carregar estilos');
      }
    };

    window.handleGetAvailableLayersResult = (result: {
      success: boolean;
      message?: string;
      layers?: string[];
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.layers) {
        setAvailableLayers(result.layers);
      } else {
        toast.error(result.message || 'Erro ao carregar camadas');
      }
    };

    window.handleGetVisibleLayersResult = (result: {
      success: boolean;
      message?: string;
      layers?: string[];
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.layers) {
        // Update current state with visible layers
        setCurrentState((prev) => ({
          ...prev!,
          activeLayers: result.layers || [],
        }));
      }
    };

    window.handleGetCurrentStateResult = (result: {
      success: boolean;
      message?: string;
      style?: string;
      cameraType?: string;
      activeLayers?: string[];
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success) {
        setCurrentState({
          style: result.style || '',
          cameraType: result.cameraType || 'iso_perspectiva',
          activeLayers: result.activeLayers || [],
        });
      } else {
        toast.error(result.message || 'Erro ao obter estado atual');
      }
    };

    // Cleanup
    return () => {
      delete window.handleGetScenesResult;
      delete window.handleAddSceneResult;
      delete window.handleUpdateSceneResult;
      delete window.handleDeleteSceneResult;
      delete window.handleApplySceneConfigResult;
      delete window.handleSaveScenesToJsonResult;
      delete window.handleLoadScenesFromJsonResult;
      delete window.handleLoadDefaultScenesResult;
      delete window.handleLoadScenesFromFileResult;
      delete window.handleGetAvailableStylesResult;
      delete window.handleGetAvailableLayersResult;
      delete window.handleGetVisibleLayersResult;
      delete window.handleGetCurrentStateResult;
    };
  }, [clearPending, callSketchupMethod, isAvailable]);

  // PUBLIC METHODS

  const getScenes = useCallback(async () => {
    if (!isAvailable) {
      // Mock data for development
      const mockScenes: Scene[] = [
        {
          id: 'geral',
          name: 'Geral',
          style: 'FM_VISTAS',
          cameraType: 'iso_perspectiva',
          activeLayers: ['Layer0'],
        },
      ];
      setData((prev) => ({ ...prev, scenes: mockScenes }));
      return;
    }

    setIsLoading(true);
    setPendingAction('getScenes');
    await callSketchupMethod('getScenes');
  }, [callSketchupMethod, isAvailable]);

  const addScene = useCallback(
    async (params: Partial<Scene>) => {
      if (!params.name || params.name.trim() === '') {
        toast.error('Nome da cena é obrigatório');
        return false;
      }

      if (!isAvailable) {
        toast.info('Cena adicionada (modo simulação)');
        return true;
      }

      setPendingAction('addScene');
      await callSketchupMethod('addScene', params);
      return true;
    },
    [callSketchupMethod, isAvailable]
  );

  const updateScene = useCallback(
    async (name: string, params: Partial<Scene>) => {
      if (!isAvailable) {
        toast.info('Cena atualizada (modo simulação)');
        return true;
      }

      setPendingAction('updateScene');
      await callSketchupMethod('updateScene', { name, ...params });
      return true;
    },
    [callSketchupMethod, isAvailable]
  );

  const deleteScene = useCallback(
    async (name: string) => {
      const confirmed = confirm(`Deseja realmente remover a cena "${name}"?`);
      if (!confirmed) return;

      if (!isAvailable) {
        toast.info('Cena removida (modo simulação)');
        return;
      }

      setPendingAction('deleteScene');
      await callSketchupMethod('deleteScene', { name });
    },
    [callSketchupMethod, isAvailable]
  );

  const applySceneConfig = useCallback(
    async (name: string, config: Partial<Scene>) => {
      if (!isAvailable) {
        toast.info('Configuração aplicada (modo simulação)');
        return;
      }

      setPendingAction('applyConfig');
      await callSketchupMethod('applySceneConfig', { name, config });
    },
    [callSketchupMethod, isAvailable]
  );

  const saveToJson = useCallback(async () => {
    if (!isAvailable) {
      toast.info('Configurações salvas (modo simulação)');
      return;
    }

    setPendingAction('save');
    await callSketchupMethod(
      'saveScenesToJson',
      data as unknown as Record<string, unknown>
    );
  }, [callSketchupMethod, data, isAvailable]);

  const loadFromJson = useCallback(async () => {
    if (!isAvailable) {
      toast.info('Configurações carregadas (modo simulação)');
      return;
    }

    setIsLoading(true);
    setPendingAction('loadJson');
    await callSketchupMethod('loadScenesFromJson');
  }, [callSketchupMethod, isAvailable]);

  const loadDefault = useCallback(async () => {
    if (!isAvailable) {
      toast.info('Dados padrão carregados (modo simulação)');
      return;
    }

    setIsLoading(true);
    setPendingAction('loadDefault');
    await callSketchupMethod('loadDefaultScenes');
  }, [callSketchupMethod, isAvailable]);

  const loadFromFile = useCallback(async () => {
    if (!isAvailable) {
      toast.info('Arquivo carregado (modo simulação)');
      return;
    }

    setIsLoading(true);
    setPendingAction('loadFile');
    await callSketchupMethod('loadScenesFromFile');
  }, [callSketchupMethod, isAvailable]);

  const getAvailableStyles = useCallback(async () => {
    if (!isAvailable) {
      setAvailableStyles(['FM_VISTAS', 'FM_PLANTAS', 'FM_CORTES', 'FM_3D']);
      return;
    }

    setIsLoading(true);
    setPendingAction('getStyles');
    await callSketchupMethod('getAvailableStyles');
  }, [callSketchupMethod, isAvailable]);

  const getAvailableLayers = useCallback(async () => {
    if (!isAvailable) {
      setAvailableLayers(['Layer0', '-2D-AMBIENTE', '-2D-ESQUADRIA']);
      return;
    }

    setIsLoading(true);
    setPendingAction('getLayers');
    await callSketchupMethod('getAvailableLayers');
  }, [callSketchupMethod, isAvailable]);

  const getCurrentState = useCallback(async () => {
    if (!isAvailable) {
      setCurrentState({
        style: 'FM_VISTAS',
        cameraType: 'iso_perspectiva',
        activeLayers: ['Layer0'],
      });
      return;
    }

    setIsLoading(true);
    setPendingAction('getCurrentState');
    await callSketchupMethod('getCurrentState');
  }, [callSketchupMethod, isAvailable]);

  const clearAll = useCallback(() => {
    if (!confirm('Deseja realmente limpar todos os dados?')) return;
    setData({ groups: [], scenes: [] });
    toast.info('Dados limpos');
  }, []);

  const isBusy = isAvailable && (isLoading || Boolean(pendingAction));

  // Initialize data on mount
  useEffect(() => {
    loadFromJson();
    getAvailableStyles();
    getAvailableLayers();

    // Não chamar getScenes() aqui - loadFromJson() já traz os dados
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    setData,
    availableStyles,
    availableLayers,
    currentState,
    isBusy,
    isLoading,
    isAvailable,
    getScenes,
    addScene,
    updateScene,
    deleteScene,
    applySceneConfig,
    saveToJson,
    loadFromJson,
    loadDefault,
    loadFromFile,
    getAvailableStyles,
    getAvailableLayers,
    getCurrentState,
    clearAll,
  };
}
