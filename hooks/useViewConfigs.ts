'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export interface ViewConfig {
  id: string;
  name: string;
  style: string;
  cameraType: string;
  activeLayers: string[];
}

export interface ViewConfigGroup {
  id: string;
  name: string;
  [key: string]: unknown; // Para permitir 'scenes' ou 'plans'
}

export interface ViewConfigsData {
  groups: ViewConfigGroup[];
  [key: string]: unknown; // Para permitir 'scenes' ou 'plans'
}

export interface CurrentState {
  style: string;
  cameraType: string;
  activeLayers: string[];
}

interface UseViewConfigsOptions {
  entityName: 'scenes' | 'plans';
  entityNameSingular: 'scene' | 'plan';
  rubyMethods: {
    get: string;
    add: string;
    update: string;
    delete: string;
    applyConfig: string;
    saveToJson: string;
    loadFromJson: string;
    loadDefault: string;
    loadFromFile: string;
    getAvailableStyles: string;
    getAvailableLayers: string;
    getVisibleLayers: string;
    getCurrentState: string;
  };
  handlers: {
    get: string;
    add: string;
    update: string;
    delete: string;
    applyConfig: string;
    saveToJson: string;
    loadFromJson: string;
    loadDefault: string;
    loadFromFile: string;
    getAvailableStyles: string;
    getAvailableLayers: string;
    getVisibleLayers: string;
    getCurrentState: string;
  };
  mockData?: ViewConfig[];
}

export function useViewConfigs(options: UseViewConfigsOptions) {
  const { callSketchupMethod, isAvailable } = useSketchup();
  const [data, setData] = useState<ViewConfigsData>({
    groups: [],
    [options.entityName]: [],
  });
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
    // GET handler
    (window as unknown as Record<string, unknown>)[options.handlers.get] =
      (result: {
        success: boolean;
        message?: string;
        scenes?: ViewConfig[];
        plans?: ViewConfig[];
      }) => {
        clearPending();
        setIsLoading(false);
        if (result.success && result[options.entityName]) {
          setData((prev) => ({
            ...prev,
            [options.entityName]: result[options.entityName] || [],
          }));
        } else {
          toast.error(
            result.message || `Erro ao carregar ${options.entityName}`
          );
        }
      };

    // ADD handler
    (window as unknown as Record<string, unknown>)[options.handlers.add] =
      (result: {
        success: boolean;
        message: string;
        [key: string]: unknown;
      }) => {
        clearPending();
        if (result.success) {
          toast.success(result.message);
          if (isAvailable) {
            callSketchupMethod(options.rubyMethods.get).catch(() => {});
          }
        } else {
          toast.error(result.message);
        }
      };

    // UPDATE handler
    (window as unknown as Record<string, unknown>)[options.handlers.update] =
      (result: { success: boolean; message: string }) => {
        clearPending();
        if (result.success) {
          toast.success(result.message);
          if (isAvailable) {
            callSketchupMethod(options.rubyMethods.get).catch(() => {});
          }
        } else {
          toast.error(result.message);
        }
      };

    // DELETE handler
    (window as unknown as Record<string, unknown>)[options.handlers.delete] =
      (result: { success: boolean; message: string }) => {
        clearPending();
        if (result.success) {
          toast.success(result.message);
          if (isAvailable) {
            callSketchupMethod(options.rubyMethods.get).catch(() => {});
          }
        } else {
          toast.error(result.message);
        }
      };

    // APPLY CONFIG handler
    (window as unknown as Record<string, unknown>)[
      options.handlers.applyConfig
    ] = (result: { success: boolean; message: string }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };

    // SAVE TO JSON handler
    (window as unknown as Record<string, unknown>)[
      options.handlers.saveToJson
    ] = (result: { success: boolean; message: string; path?: string }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };

    // LOAD FROM JSON handler
    (window as unknown as Record<string, unknown>)[
      options.handlers.loadFromJson
    ] = (result: {
      success: boolean;
      message: string;
      data?: ViewConfigsData;
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.data) {
        // Normalize groups to ensure segments is always an array
        const normalizedData = {
          ...result.data,
          groups: (result.data.groups || []).map((group) => ({
            ...group,
            segments: Array.isArray(group.segments) ? group.segments : [],
          })),
        };
        setData(normalizedData);
        if (pendingAction !== 'loadJson') {
          toast.success(result.message);
        }
      } else {
        if (!result.success) {
          // Fallback: carregar do SketchUp
          callSketchupMethod(options.rubyMethods.get).catch(() => {});
        }
      }
    };

    // LOAD DEFAULT handler
    (window as unknown as Record<string, unknown>)[
      options.handlers.loadDefault
    ] = (result: {
      success: boolean;
      message: string;
      data?: ViewConfigsData;
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.data) {
        // Normalize groups to ensure segments is always an array
        const normalizedData = {
          ...result.data,
          groups: (result.data.groups || []).map((group) => ({
            ...group,
            segments: Array.isArray(group.segments) ? group.segments : [],
          })),
        };
        setData(normalizedData);
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Erro ao carregar dados padrão');
      }
    };

    // LOAD FROM FILE handler
    (window as unknown as Record<string, unknown>)[
      options.handlers.loadFromFile
    ] = (result: {
      success: boolean;
      message: string;
      data?: ViewConfigsData;
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.data) {
        // Normalize groups to ensure segments is always an array
        const normalizedData = {
          ...result.data,
          groups: (result.data.groups || []).map((group) => ({
            ...group,
            segments: Array.isArray(group.segments) ? group.segments : [],
          })),
        };
        setData(normalizedData);
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Erro ao carregar arquivo');
      }
    };

    // GET AVAILABLE STYLES handler
    (window as unknown as Record<string, unknown>)[
      options.handlers.getAvailableStyles
    ] = (result: { success: boolean; message?: string; styles?: string[] }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.styles) {
        setAvailableStyles(result.styles);
      } else {
        toast.error(result.message || 'Erro ao carregar estilos');
      }
    };

    // GET AVAILABLE LAYERS handler
    (window as unknown as Record<string, unknown>)[
      options.handlers.getAvailableLayers
    ] = (result: { success: boolean; message?: string; layers?: string[] }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.layers) {
        setAvailableLayers(result.layers);
      } else {
        toast.error(result.message || 'Erro ao carregar camadas');
      }
    };

    // GET VISIBLE LAYERS handler
    (window as unknown as Record<string, unknown>)[
      options.handlers.getVisibleLayers
    ] = (result: { success: boolean; message?: string; layers?: string[] }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.layers) {
        setCurrentState((prev) => ({
          ...prev!,
          activeLayers: result.layers || [],
        }));
      }
    };

    // GET CURRENT STATE handler
    (window as unknown as Record<string, unknown>)[
      options.handlers.getCurrentState
    ] = (result: {
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
      const w = window as unknown as Record<string, unknown>;
      delete w[options.handlers.get];
      delete w[options.handlers.add];
      delete w[options.handlers.update];
      delete w[options.handlers.delete];
      delete w[options.handlers.applyConfig];
      delete w[options.handlers.saveToJson];
      delete w[options.handlers.loadFromJson];
      delete w[options.handlers.loadDefault];
      delete w[options.handlers.loadFromFile];
      delete w[options.handlers.getAvailableStyles];
      delete w[options.handlers.getAvailableLayers];
      delete w[options.handlers.getVisibleLayers];
      delete w[options.handlers.getCurrentState];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearPending, callSketchupMethod, isAvailable]);

  // PUBLIC METHODS

  const getItems = useCallback(async () => {
    if (!isAvailable) {
      const mockData = options.mockData || [];
      setData((prev) => ({ ...prev, [options.entityName]: mockData }));
      return;
    }

    setIsLoading(true);
    setPendingAction('get');
    await callSketchupMethod(options.rubyMethods.get);
  }, [callSketchupMethod, isAvailable, options]);

  const addItem = useCallback(
    async (params: Partial<ViewConfig>) => {
      if (!params.name || params.name.trim() === '') {
        toast.error(`Nome da ${options.entityNameSingular} é obrigatório`);
        return false;
      }

      if (!isAvailable) {
        toast.info(
          `${
            options.entityNameSingular.charAt(0).toUpperCase() +
            options.entityNameSingular.slice(1)
          } adicionada (modo simulação)`
        );
        return true;
      }

      setPendingAction('add');
      await callSketchupMethod(options.rubyMethods.add, params);
      return true;
    },
    [callSketchupMethod, isAvailable, options]
  );

  const updateItem = useCallback(
    async (name: string, params: Partial<ViewConfig>) => {
      if (!isAvailable) {
        toast.info(
          `${
            options.entityNameSingular.charAt(0).toUpperCase() +
            options.entityNameSingular.slice(1)
          } atualizada (modo simulação)`
        );
        return true;
      }

      setPendingAction('update');
      await callSketchupMethod(options.rubyMethods.update, { name, ...params });
      return true;
    },
    [callSketchupMethod, isAvailable, options]
  );

  const deleteItem = useCallback(
    async (name: string) => {
      const confirmed = confirm(
        `Deseja realmente remover a ${options.entityNameSingular} "${name}"?`
      );
      if (!confirmed) return;

      if (!isAvailable) {
        toast.info(
          `${
            options.entityNameSingular.charAt(0).toUpperCase() +
            options.entityNameSingular.slice(1)
          } removida (modo simulação)`
        );
        return;
      }

      setPendingAction('delete');
      await callSketchupMethod(options.rubyMethods.delete, { name });
    },
    [callSketchupMethod, isAvailable, options]
  );

  const applyConfig = useCallback(
    async (name: string, config: Partial<ViewConfig>) => {
      if (!isAvailable) {
        toast.info('Configuração aplicada (modo simulação)');
        return;
      }

      setPendingAction('applyConfig');
      await callSketchupMethod(options.rubyMethods.applyConfig, {
        name,
        config,
      });
    },
    [callSketchupMethod, isAvailable, options]
  );

  const saveToJson = useCallback(async () => {
    if (!isAvailable) {
      toast.info('Configurações salvas (modo simulação)');
      return;
    }

    setPendingAction('save');
    await callSketchupMethod(
      options.rubyMethods.saveToJson,
      data as unknown as Record<string, unknown>
    );
  }, [callSketchupMethod, data, isAvailable, options]);

  const loadFromJson = useCallback(async () => {
    if (!isAvailable) {
      toast.info('Configurações carregadas (modo simulação)');
      return;
    }

    setIsLoading(true);
    setPendingAction('loadJson');
    await callSketchupMethod(options.rubyMethods.loadFromJson);
  }, [callSketchupMethod, isAvailable, options]);

  const loadDefault = useCallback(async () => {
    if (!isAvailable) {
      toast.info('Dados padrão carregados (modo simulação)');
      return;
    }

    setIsLoading(true);
    setPendingAction('loadDefault');
    await callSketchupMethod(options.rubyMethods.loadDefault);
  }, [callSketchupMethod, isAvailable, options]);

  const loadFromFile = useCallback(async () => {
    if (!isAvailable) {
      toast.info('Arquivo carregado (modo simulação)');
      return;
    }

    setIsLoading(true);
    setPendingAction('loadFile');
    await callSketchupMethod(options.rubyMethods.loadFromFile);
  }, [callSketchupMethod, isAvailable, options]);

  const getAvailableStyles = useCallback(async () => {
    if (!isAvailable) {
      setAvailableStyles(['PRO_VISTAS', 'PRO_PLANTAS', 'PRO_SECOES', 'PRO_3D']);
      return;
    }

    setIsLoading(true);
    setPendingAction('getStyles');
    await callSketchupMethod(options.rubyMethods.getAvailableStyles);
  }, [callSketchupMethod, isAvailable, options]);

  const getAvailableLayers = useCallback(async () => {
    if (!isAvailable) {
      setAvailableLayers(['Layer0', '-2D-AMBIENTE', '-2D-ESQUADRIA']);
      return;
    }

    setIsLoading(true);
    setPendingAction('getLayers');
    await callSketchupMethod(options.rubyMethods.getAvailableLayers);
  }, [callSketchupMethod, isAvailable, options]);

  const getCurrentState = useCallback(async () => {
    if (!isAvailable) {
      setCurrentState({
        style: 'PRO_VISTAS',
        cameraType: 'iso_perspectiva',
        activeLayers: ['Layer0'],
      });
      return;
    }

    setIsLoading(true);
    setPendingAction('getCurrentState');
    await callSketchupMethod(options.rubyMethods.getCurrentState);
  }, [callSketchupMethod, isAvailable, options]);

  const clearAll = useCallback(() => {
    if (!confirm('Deseja realmente limpar todos os dados?')) return;
    setData({ groups: [], [options.entityName]: [] });
    toast.info('Dados limpos');
  }, [options]);

  const isBusy = isAvailable && (isLoading || Boolean(pendingAction));

  useEffect(() => {
    loadFromJson();
    getAvailableStyles();
    getAvailableLayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    isBusy,
    isLoading,
    isAvailable,
    currentState,
    availableStyles,
    availableLayers,
    setData,
    clearAll,
    addItem,
    getItems,
    saveToJson,
    updateItem,
    loadDefault,
    deleteItem,
    loadFromJson,
    loadFromFile,
    getCurrentState,
    applyConfig,
    getAvailableStyles,
    getAvailableLayers,
  };
}
