'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';
import { useConfirm } from './useConfirm';

export type Level = {
  number: number;
  height_meters: number;
  has_base: boolean;
  has_ceiling: boolean;
  name: string;
  base_cut_height: number;
  ceiling_cut_height: number;
};

export function useLevels() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();
  const { confirm, ConfirmDialog } = useConfirm();
  const [levels, setLevels] = useState<Level[]>([]);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const clearPending = useCallback(() => {
    setPendingAction(null);
  }, []);

  useEffect(() => {
    window.handleGetLevelsResult = (result: {
      success: boolean;
      message?: string;
      levels?: Level[];
    }) => {
      clearPending();
      if (result.success && result.levels) {
        setLevels(result.levels);
      } else {
        toast.error(result.message || 'Erro ao carregar níveis');
      }
    };

    window.handleAddLevelResult = (result: {
      success: boolean;
      message: string;
      level?: Level;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
        loadLevels();
      } else {
        toast.error(result.message);
      }
    };

    window.handleRemoveLevelResult = (result: {
      success: boolean;
      message: string;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
        loadLevels();
      } else {
        toast.error(result.message);
      }
    };

    window.handleCreateBaseSceneResult = (result: {
      success: boolean;
      message: string;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
        loadLevels();
      } else {
        toast.error(result.message);
      }
    };

    window.handleCreateCeilingSceneResult = (result: {
      success: boolean;
      message: string;
    }) => {
      clearPending();
      if (result.success) {
        toast.success(result.message);
        loadLevels();
      } else {
        toast.error(result.message);
      }
    };

    return () => {
      delete window.handleGetLevelsResult;
      delete window.handleAddLevelResult;
      delete window.handleRemoveLevelResult;
      delete window.handleCreateBaseSceneResult;
      delete window.handleCreateCeilingSceneResult;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearPending]);

  const loadLevels = useCallback(async () => {
    if (!isAvailable) {
      // Mock data
      setLevels([
        {
          number: 1,
          height_meters: 0.0,
          has_base: false,
          has_ceiling: false,
          name: 'Térreo',
          base_cut_height: 0.0,
          ceiling_cut_height: 0.0,
        },
      ]);
      return;
    }

    setPendingAction('load');
    await callSketchupMethod('getLevels');
  }, [callSketchupMethod, isAvailable]);

  const addLevel = useCallback(
    async (heightMeters: number) => {
      if (!isAvailable) {
        const newLevel: Level = {
          number: levels.length + 1,
          height_meters: heightMeters,
          has_base: false,
          has_ceiling: false,
          name: levels.length === 0 ? 'Térreo' : `Pavimento ${levels.length}`,
          base_cut_height: heightMeters,
          ceiling_cut_height: heightMeters,
        };
        setLevels([...levels, newLevel]);
        toast.success('Nível adicionado (modo simulação)');
        return;
      }

      const heightStr = heightMeters.toString();

      setPendingAction('add');
      await callSketchupMethod('addLevel', { height: heightStr });
    },
    [callSketchupMethod, isAvailable, levels]
  );

  const removeLevel = useCallback(
    async (number: number) => {
      const confirmed = await confirm({
        title: 'Remover nível',
        description: 'Deseja realmente remover este nível?',
        confirmText: 'Remover',
        cancelText: 'Cancelar',
        variant: 'destructive',
      });

      if (!confirmed) return;

      if (!isAvailable) {
        setLevels(levels.filter((l) => l.number !== number));
        toast.info('Nível removido (modo simulação)');
        return;
      }

      setPendingAction('remove');
      await callSketchupMethod('removeLevel', { number: number.toString() });
    },
    [confirm, callSketchupMethod, isAvailable, levels]
  );

  const createBaseScene = useCallback(
    async (number: number) => {
      if (!isAvailable) {
        setLevels(
          levels.map((l) =>
            l.number === number ? { ...l, has_base: true } : l
          )
        );
        toast.success('Cena base criada (modo simulação)');
        return;
      }

      setPendingAction('createBase');
      await callSketchupMethod('createBaseScene', {
        number: number.toString(),
      });
    },
    [callSketchupMethod, isAvailable, levels]
  );

  const createCeilingScene = useCallback(
    async (number: number) => {
      if (!isAvailable) {
        setLevels(
          levels.map((l) =>
            l.number === number ? { ...l, has_ceiling: true } : l
          )
        );
        toast.success('Cena de forro criada (modo simulação)');
        return;
      }

      setPendingAction('createCeiling');
      await callSketchupMethod('createCeilingScene', {
        number: number.toString(),
      });
    },
    [callSketchupMethod, isAvailable, levels]
  );

  const isBusy = isAvailable && (isLoading || Boolean(pendingAction));

  useEffect(() => {
    loadLevels();
  }, [loadLevels]);

  return {
    levels,
    isBusy,
    isLoading,
    isAvailable,
    loadLevels,
    addLevel,
    removeLevel,
    createBaseScene,
    createCeilingScene,
    ConfirmDialog,
  };
}
