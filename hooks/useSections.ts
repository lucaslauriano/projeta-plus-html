'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export interface Section {
  id: string;
  name: string;
  position: [number, number, number];
  direction: [number, number, number];
  active: boolean;
}

export interface SectionsData {
  sections: Section[];
}

export function useSections() {
  const { callSketchupMethod, isAvailable } = useSketchup();
  const [data, setData] = useState<SectionsData>({
    sections: [],
  });
  const [isBusy, setIsBusy] = useState(false);

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
        sections?: Section[];
      }) => {
        setIsBusy(false);
        if (result.success && result.sections) {
          setData({ sections: result.sections });
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
        setData(result.data);
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
        setData(result.data);
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
        setData(result.data);
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
    };
  }, []);

  // ========================================
  // PUBLIC METHODS
  // ========================================

  const getSections = useCallback(() => {
    if (!isAvailable) {
      setData({
        sections: [
          {
            id: 'A',
            name: 'A',
            position: [0, 40, 0],
            direction: [0, 1, 0],
            active: true,
          },
        ],
      });
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
      toast.info('Cortes padrões criados (modo simulação)');
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
        toast.info('Vistas automáticas criadas (modo simulação)');
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
        toast.info('Corte individual criado (modo simulação)');
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

    setData({ sections: [] });
    toast.info('Seções limpas');
  }, []);

  // ========================================
  // LIFECYCLE
  // ========================================

  useEffect(() => {
    getSections();
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
  };
}
