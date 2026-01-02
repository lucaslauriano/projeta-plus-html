'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export interface Section {
  id: string;
  name: string;
  style: string;
  cameraType: string;
  activeLayers: string[];
  code?: string;
  position: [number, number, number];
  direction: [number, number, number];
  active?: boolean;
}

export interface SectionGroup {
  id: string;
  name: string;
  segments: Section[];
}

export interface SectionsData {
  groups: SectionGroup[];
  sections?: Section[]; // Deprecated, for backward compatibility
}

export interface SectionsSettings {
  style: string;
  activeLayers: string[];
}

export function useSections() {
  const { callSketchupMethod, isAvailable } = useSketchup();
  const [data, setData] = useState<SectionsData>({
    groups: [],
  });
  const [isBusy, setIsBusy] = useState(false);
  const [settings, setSettings] = useState<SectionsSettings>({
    style: 'PRO_VISTAS',
    activeLayers: [],
  });
  const [availableStyles, setAvailableStyles] = useState<string[]>([]);
  const [availableLayers, setAvailableLayers] = useState<string[]>([]);
  const [modelScenes, setModelScenes] = useState<
    Array<{ name: string; label?: string; description?: string }>
  >([]);

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  const callSketchupMethodSafe = useCallback(
    (method: string, params?: unknown) => {
      if (isAvailable) {
        callSketchupMethod(
          method,
          params as Record<string, unknown> | undefined
        ).catch(() => {});
      } else {
        console.warn(`[MOCK MODE] ${method}:`, params);
      }
    },
    [callSketchupMethod, isAvailable]
  );

  // ========================================
  // HANDLERS (recebem respostas do Ruby)
  // ========================================

  useEffect(() => {
    (window as unknown as Record<string, unknown>).handleGetSectionsResult =
      (result: {
        success: boolean;
        message?: string;
        data?: SectionsData;
        sections?: Section[];
      }) => {
        setIsBusy(false);
        if (result.success) {
          if (result.data) {
            // New format with groups
            setData(result.data);
          } else if (result.sections) {
            // Backward compatibility: convert flat sections to groups
            const groups = [
              {
                id: 'default',
                name: 'Sections',
                segments: result.sections,
              },
            ];
            setData({ groups, sections: result.sections });
          }
        } else {
          toast.error(result.message || 'Erro ao carregar seções');
        }
      };

    (window as unknown as Record<string, unknown>).handleAddSectionResult =
      (result: { success: boolean; message: string; section?: Section }) => {
        setIsBusy(false);
        if (result.success) {
          toast.success(result.message);
          getSections();
        } else {
          toast.error(result.message);
        }
      };

    (window as unknown as Record<string, unknown>).handleUpdateSectionResult =
      (result: { success: boolean; message: string }) => {
        setIsBusy(false);
        if (result.success) {
          toast.success(result.message);
          getSections();
        } else {
          toast.error(result.message);
        }
      };

    (window as unknown as Record<string, unknown>).handleDeleteSectionResult =
      (result: { success: boolean; message: string }) => {
        setIsBusy(false);
        if (result.success) {
          toast.success(result.message);
          getSections();
        } else {
          toast.error(result.message);
        }
      };

    (
      window as unknown as Record<string, unknown>
    ).handleCreateStandardSectionsResult = (result: {
      success: boolean;
      message: string;
      count?: number;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
        getSections();
      } else {
        toast.error(result.message);
      }
    };

    (window as unknown as Record<string, unknown>).handleCreateAutoViewsResult =
      (result: { success: boolean; message: string; count?: number }) => {
        setIsBusy(false);
        if (result.success) {
          toast.success(result.message);
          getSections();
        } else {
          toast.error(result.message);
        }
      };

    (
      window as unknown as Record<string, unknown>
    ).handleCreateIndividualSectionResult = (result: {
      success: boolean;
      message: string;
      section?: Section;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
        getSections();
      } else {
        toast.error(result.message);
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleSaveSectionsToJsonResult = (result: {
      success: boolean;
      message: string;
      path?: string;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleLoadSectionsFromJsonResult = (result: {
      success: boolean;
      message: string;
      data?: SectionsData;
    }) => {
      setIsBusy(false);
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
        toast.error(result.message || 'Erro ao carregar configurações');
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleLoadDefaultSectionsResult = (result: {
      success: boolean;
      message: string;
      data?: SectionsData;
    }) => {
      setIsBusy(false);
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

    (
      window as unknown as Record<string, unknown>
    ).handleLoadSectionsFromFileResult = (result: {
      success: boolean;
      message: string;
      data?: SectionsData;
    }) => {
      setIsBusy(false);
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

    (
      window as unknown as Record<string, unknown>
    ).handleImportSectionsToModelResult = (result: {
      success: boolean;
      message: string;
      count?: number;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
        getSections();
      } else {
        toast.error(result.message);
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleGetSectionsSettingsResult = (result: {
      success: boolean;
      message?: string;
      settings?: SectionsSettings;
    }) => {
      setIsBusy(false);
      if (result.success && result.settings) {
        setSettings(result.settings);
      } else {
        toast.error(result.message || 'Erro ao carregar configurações');
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleSaveSectionsSettingsResult = (result: {
      success: boolean;
      message: string;
      settings?: SectionsSettings;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
        if (result.settings) {
          setSettings(result.settings);
        }
      } else {
        toast.error(result.message);
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleGetAvailableStylesForSectionsResult = (result: {
      success: boolean;
      message?: string;
      styles?: string[];
    }) => {
      setIsBusy(false);
      if (result.success && result.styles) {
        setAvailableStyles(result.styles);
      } else if (!result.success) {
        toast.error(result.message || 'Erro ao carregar estilos');
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleGetAvailableLayersForSectionsResult = (result: {
      success: boolean;
      message?: string;
      layers?: string[];
    }) => {
      setIsBusy(false);
      if (result.success && result.layers) {
        setAvailableLayers(result.layers);
      } else if (!result.success) {
        toast.error(result.message || 'Erro ao carregar camadas');
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleApplyCurrentStyleToSectionsResult = (result: {
      success: boolean;
      message?: string;
      style?: string;
    }) => {
      setIsBusy(false);
      if (result.success && result.style) {
        setSettings((prev) => ({ ...prev, style: result.style! }));
        toast.success(result.message || 'Estilo capturado');
      } else {
        toast.error(result.message || 'Erro ao capturar estilo');
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleGetCurrentActiveLayersResult = (result: {
      success: boolean;
      message?: string;
      layers?: string[];
    }) => {
      setIsBusy(false);
      if (result.success && result.layers) {
        setSettings((prev) => ({ ...prev, activeLayers: result.layers! }));
        toast.success(result.message || 'Camadas capturadas');
      } else {
        toast.error(result.message || 'Erro ao capturar camadas');
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleGetCurrentActiveLayersFilteredResult = (result: {
      success: boolean;
      message?: string;
      layers?: string[];
    }) => {
      setIsBusy(false);
      if (result.success && result.layers) {
        // Call the callback if it exists
        const callback = (window as unknown as Record<string, unknown>)
          ._getCurrentActiveLayersFilteredCallback;
        if (typeof callback === 'function') {
          callback(result.layers);
          delete (window as unknown as Record<string, unknown>)
            ._getCurrentActiveLayersFilteredCallback;
        }
        toast.success(result.message || 'Camadas capturadas');
      } else {
        toast.error(result.message || 'Erro ao capturar camadas');
      }
    };

    // Groups handlers
    (
      window as unknown as Record<string, unknown>
    ).handleAddSectionsGroupResult = (result: {
      success: boolean;
      message: string;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
        getSections();
      } else {
        toast.error(result.message);
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleUpdateSectionsGroupResult = (result: {
      success: boolean;
      message: string;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
        getSections();
      } else {
        toast.error(result.message);
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleDeleteSectionsGroupResult = (result: {
      success: boolean;
      message: string;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
        getSections();
      } else {
        toast.error(result.message);
      }
    };

    // Segments handlers
    (
      window as unknown as Record<string, unknown>
    ).handleAddSectionsSegmentResult = (result: {
      success: boolean;
      message: string;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
        getSections();
      } else {
        toast.error(result.message);
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleUpdateSectionsSegmentResult = (result: {
      success: boolean;
      message: string;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
        getSections();
      } else {
        toast.error(result.message);
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleDeleteSectionsSegmentResult = (result: {
      success: boolean;
      message: string;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
        getSections();
      } else {
        toast.error(result.message);
      }
    };

    (
      window as unknown as Record<string, unknown>
    ).handleDuplicateScenesWithSegmentResult = (result: {
      success: boolean;
      message: string;
      count?: number;
    }) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };

    (window as unknown as Record<string, unknown>).handleGetModelScenesResult =
      (result: {
        success: boolean;
        message?: string;
        scenes?: Array<{ name: string; label?: string; description?: string }>;
      }) => {
        setIsBusy(false);
        if (result.success && result.scenes) {
          setModelScenes(result.scenes);
        } else if (!result.success && result.message) {
          toast.error(result.message);
        }
      };

    // Cleanup
    return () => {
      const w = window as unknown as Record<string, unknown>;
      delete w.handleGetSectionsResult;
      delete w.handleAddSectionResult;
      delete w.handleUpdateSectionResult;
      delete w.handleDeleteSectionResult;
      delete w.handleCreateStandardSectionsResult;
      delete w.handleCreateAutoViewsResult;
      delete w.handleCreateIndividualSectionResult;
      delete w.handleSaveSectionsToJsonResult;
      delete w.handleLoadSectionsFromJsonResult;
      delete w.handleLoadDefaultSectionsResult;
      delete w.handleLoadSectionsFromFileResult;
      delete w.handleImportSectionsToModelResult;
      delete w.handleGetSectionsSettingsResult;
      delete w.handleSaveSectionsSettingsResult;
      delete w.handleGetAvailableStylesForSectionsResult;
      delete w.handleGetAvailableLayersForSectionsResult;
      delete w.handleApplyCurrentStyleToSectionsResult;
      delete w.handleGetCurrentActiveLayersResult;
      delete w.handleGetCurrentActiveLayersFilteredResult;
      delete w.handleAddSectionsGroupResult;
      delete w.handleUpdateSectionsGroupResult;
      delete w.handleDeleteSectionsGroupResult;
      delete w.handleAddSectionsSegmentResult;
      delete w.handleUpdateSectionsSegmentResult;
      delete w.handleDeleteSectionsSegmentResult;
      delete w.handleDuplicateScenesWithSegmentResult;
      delete w.handleGetModelScenesResult;
    };
  }, []);

  // ========================================
  // PUBLIC METHODS
  // ========================================

  const getSections = useCallback(() => {
    if (!isAvailable) {
      setData({ groups: [] });
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('getSections');
  }, [callSketchupMethodSafe, isAvailable]);

  const addSection = useCallback(
    async (params: Partial<Section>) => {
      if (!params.name || params.name.trim() === '') {
        toast.error('Nome da seção é obrigatório');
        return false;
      }

      if (!params.position || !params.direction) {
        toast.error('Posição e direção são obrigatórias');
        return false;
      }

      if (!isAvailable) {
        toast.info('Seção adicionada (modo simulação)');
        return true;
      }

      setIsBusy(true);
      callSketchupMethodSafe('addSection', params);
      return true;
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const updateSection = useCallback(
    async (name: string, params: Partial<Section>) => {
      if (!isAvailable) {
        toast.info('Seção atualizada (modo simulação)');
        return true;
      }

      setIsBusy(true);
      callSketchupMethodSafe('updateSection', { name, ...params });
      return true;
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const deleteSection = useCallback(
    async (name: string) => {
      const confirmed = confirm(`Deseja realmente remover a seção "${name}"?`);
      if (!confirmed) return;

      if (!isAvailable) {
        toast.info('Seção removida (modo simulação)');
        return;
      }

      setIsBusy(true);
      callSketchupMethodSafe('deleteSection', { name });
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const createStandardSections = useCallback(() => {
    if (!isAvailable) {
      toast.info('Seções gerais criadas (modo simulação)');
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('createStandardSections');
  }, [callSketchupMethodSafe, isAvailable]);

  const createAutoViews = useCallback(
    (environmentName: string) => {
      if (!environmentName || environmentName.trim() === '') {
        toast.error('Nome do ambiente é obrigatório');
        return;
      }

      if (!isAvailable) {
        toast.info('Seções por ambiente criadas (modo simulação)');
        return;
      }

      setIsBusy(true);
      callSketchupMethodSafe('createAutoViews', { environmentName });
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const createIndividualSection = useCallback(
    (directionType: string, name: string) => {
      if (!name || name.trim() === '') {
        toast.error('Nome da seção é obrigatório');
        return;
      }

      if (!isAvailable) {
        toast.info('Seção individual criado (modo simulação)');
        return;
      }

      setIsBusy(true);
      callSketchupMethodSafe('createIndividualSection', {
        directionType,
        name,
      });
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const saveToJson = useCallback(() => {
    if (!isAvailable) {
      toast.info('Configurações salvas (modo simulação)');
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('saveSectionsToJson', data);
  }, [callSketchupMethodSafe, data, isAvailable]);

  const loadFromJson = useCallback(() => {
    if (!isAvailable) {
      toast.info('Configurações carregadas (modo simulação)');
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('loadSectionsFromJson');
  }, [callSketchupMethodSafe, isAvailable]);

  const loadDefault = useCallback(() => {
    if (!isAvailable) {
      toast.info('Dados padrão carregados (modo simulação)');
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('loadDefaultSections');
  }, [callSketchupMethodSafe, isAvailable]);

  const loadFromFile = useCallback(() => {
    if (!isAvailable) {
      toast.info('Arquivo carregado (modo simulação)');
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('loadSectionsFromFile');
  }, [callSketchupMethodSafe, isAvailable]);

  const importToModel = useCallback(() => {
    if (!isAvailable) {
      toast.info('Seções importadas (modo simulação)');
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('importSectionsToModel', data);
  }, [callSketchupMethodSafe, data, isAvailable]);

  const clearAll = useCallback(() => {
    const confirmed = confirm('Deseja realmente limpar todas as seções?');
    if (!confirmed) return;

    setData({ groups: [] });
    toast.info('Seções limpas');
  }, []);

  const getSectionsSettings = useCallback(() => {
    if (!isAvailable) {
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('getSectionsSettings');
  }, [callSketchupMethodSafe, isAvailable]);

  const saveSectionsSettings = useCallback(
    (newSettings: SectionsSettings) => {
      if (!isAvailable) {
        toast.info('Configurações salvas (modo simulação)');
        setSettings(newSettings);
        return;
      }

      setIsBusy(true);
      callSketchupMethodSafe('saveSectionsSettings', newSettings);
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const getAvailableStylesForSections = useCallback(() => {
    if (!isAvailable) {
      setAvailableStyles(['PRO_VISTAS', 'PRO_PLANTAS']);
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('getAvailableStylesForSections');
  }, [callSketchupMethodSafe, isAvailable]);

  const getAvailableLayersForSections = useCallback(() => {
    if (!isAvailable) {
      setAvailableLayers(['Layer0']);
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('getAvailableLayersForSections');
  }, [callSketchupMethodSafe, isAvailable]);

  const applyCurrentStyleToSections = useCallback(() => {
    if (!isAvailable) {
      toast.info('Estilo capturado (modo simulação)');
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('applyCurrentStyleToSections');
  }, [callSketchupMethodSafe, isAvailable]);

  const getCurrentActiveLayers = useCallback(() => {
    if (!isAvailable) {
      toast.info('Camadas capturadas (modo simulação)');
      return;
    }

    setIsBusy(true);
    callSketchupMethodSafe('getCurrentActiveLayers');
  }, [callSketchupMethodSafe, isAvailable]);

  const getCurrentActiveLayersFiltered = useCallback(
    (availableLayers: string[], callback?: (layers: string[]) => void) => {
      if (!isAvailable) {
        toast.info('Camadas capturadas (modo simulação)');
        if (callback) callback([]);
        return;
      }

      // Store callback for later use
      if (callback) {
        (
          window as Window & {
            _getCurrentActiveLayersFilteredCallback?: (
              layers: string[]
            ) => void;
          }
        )._getCurrentActiveLayersFilteredCallback = callback;
      }

      setIsBusy(true);
      callSketchupMethodSafe('getCurrentActiveLayersFiltered', {
        availableLayers,
      });
    },
    [callSketchupMethodSafe, isAvailable]
  );

  // Groups methods
  const addGroup = useCallback(
    (params: { name: string }) => {
      if (!isAvailable) {
        toast.info('Grupo adicionado (modo simulação)');
        return;
      }

      setIsBusy(true);
      callSketchupMethodSafe('addSectionsGroup', {
        ...params,
        id: Date.now().toString(),
      });
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const updateGroup = useCallback(
    (id: string, params: { name: string }) => {
      if (!isAvailable) {
        toast.info('Grupo atualizado (modo simulação)');
        return;
      }

      setIsBusy(true);
      callSketchupMethodSafe('updateSectionsGroup', { id, ...params });
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const deleteGroup = useCallback(
    (id: string) => {
      if (!isAvailable) {
        toast.info('Grupo removido (modo simulação)');
        return;
      }

      setIsBusy(true);
      callSketchupMethodSafe('deleteSectionsGroup', { id });
    },
    [callSketchupMethodSafe, isAvailable]
  );

  // Segments methods
  const addSegment = useCallback(
    (
      groupId: string,
      params: {
        name: string;
        code: string;
        style: string;
        activeLayers: string[];
      }
    ) => {
      if (!isAvailable) {
        toast.info('Segmento adicionado (modo simulação)');
        return;
      }

      setIsBusy(true);
      callSketchupMethodSafe('addSectionsSegment', {
        groupId,
        ...params,
        id: Date.now().toString(),
      });
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const updateSegment = useCallback(
    (
      groupId: string,
      segmentId: string,
      params: Partial<{
        name: string;
        code: string;
        style: string;
        activeLayers: string[];
      }>
    ) => {
      if (!isAvailable) {
        toast.info('Segmento atualizado (modo simulação)');
        return;
      }

      setIsBusy(true);
      callSketchupMethodSafe('updateSectionsSegment', {
        groupId,
        id: segmentId,
        ...params,
      });
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const deleteSegment = useCallback(
    (groupId: string, segmentId: string) => {
      if (!isAvailable) {
        toast.info('Segmento removido (modo simulação)');
        return;
      }

      setIsBusy(true);
      callSketchupMethodSafe('deleteSectionsSegment', {
        groupId,
        id: segmentId,
      });
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const duplicateScenesWithSegment = useCallback(
    (params: {
      sceneNames: string[];
      code: string;
      style: string;
      activeLayers: string[];
    }) => {
      if (!isAvailable) {
        toast.info('Cenas duplicadas (modo simulação)');
        return;
      }

      setIsBusy(true);
      callSketchupMethodSafe('duplicateScenesWithSegment', params);
    },
    [callSketchupMethodSafe, isAvailable]
  );

  const getModelScenes = useCallback(() => {
    if (!isAvailable) {
      return Promise.resolve([]);
    }

    setIsBusy(true);
    callSketchupMethodSafe('getModelScenes');
    return new Promise<
      Array<{ name: string; label?: string; description?: string }>
    >((resolve) => {
      const checkScenes = setInterval(() => {
        if (!isBusy) {
          clearInterval(checkScenes);
          resolve(modelScenes);
        }
      }, 100);

      // Timeout após 5 segundos
      setTimeout(() => {
        clearInterval(checkScenes);
        resolve(modelScenes);
      }, 5000);
    });
  }, [callSketchupMethodSafe, isAvailable, isBusy, modelScenes]);

  // ========================================
  // LIFECYCLE
  // ========================================

  useEffect(() => {
    getSections();
    getSectionsSettings();
    getAvailableStylesForSections();
    getAvailableLayersForSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========================================
  // RETURN
  // ========================================

  return {
    data,
    isBusy,
    isAvailable,
    getSections,
    addSection,
    updateSection,
    deleteSection,
    createStandardSections,
    createAutoViews,
    createIndividualSection,
    saveToJson,
    loadFromJson,
    loadDefault,
    loadFromFile,
    importToModel,
    clearAll,
    settings,
    availableStyles,
    availableLayers,
    modelScenes,
    getSectionsSettings,
    saveSectionsSettings,
    getAvailableStylesForSections,
    getAvailableLayersForSections,
    applyCurrentStyleToSections,
    getCurrentActiveLayers,
    getCurrentActiveLayersFiltered,
    addGroup,
    updateGroup,
    deleteGroup,
    addSegment,
    updateSegment,
    deleteSegment,
    duplicateScenesWithSegment,
    getModelScenes,
  };
}
