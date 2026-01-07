'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { ViewConfigSegment } from '@/types/global';

export type Plan = ViewConfigSegment;

export function usePlanEditor(
  data: { groups: unknown; plans: unknown[] },
  availableStyles: string[],
  availableLayers: string[],
  getCurrentState: () => Promise<{
    style: string;
    cameraType: string;
    activeLayers: string[];
  }>,
  currentState: {
    style: string;
    cameraType: string;
    activeLayers: string[];
  } | null,
  setData: (data: unknown) => void,
  saveToJson: (dataToSave?: unknown) => Promise<void>
) {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanCode, setEditPlanCode] = useState('');
  const [editPlanStyle, setEditPlanStyle] = useState('');
  const [editCameraType, setEditCameraType] = useState('');
  const [editActiveLayers, setEditActiveLayers] = useState<string[]>([]);

  const openEditor = useCallback(
    (plan: Plan) => {
      setEditingPlan(plan);
      setEditPlanName(plan.name || '');
      setEditPlanCode(
        plan.code || plan.name?.toLowerCase().replace(/\s+/g, '_') || ''
      );
      setEditPlanStyle(plan.style || availableStyles[0] || 'PRO_PLANTAS');
      setEditCameraType(plan.cameraType || 'topo_ortogonal');
      setEditActiveLayers(plan.activeLayers || ['Layer0']);
    },
    [availableStyles]
  );

  const closeEditor = useCallback(() => {
    setEditingPlan(null);
  }, []);

  const applyCurrentState = useCallback(async () => {
    const state = await getCurrentState();
    if (state) {
      setEditPlanStyle(state.style);
      setEditCameraType(state.cameraType);
      setEditActiveLayers(state.activeLayers);
      toast.success('Estado atual aplicado!');
    }
  }, [getCurrentState]);

  const selectAllLayers = useCallback(() => {
    setEditActiveLayers(availableLayers);
  }, [availableLayers]);

  const selectNoLayers = useCallback(() => {
    setEditActiveLayers([]);
  }, []);

  const saveEdits = useCallback(
    async (groups: unknown[]) => {
      if (!editPlanName.trim() || !editingPlan) {
        toast.error('Digite um nome para a planta');
        return false;
      }

      const updatedGroups = (
        groups as Array<{ id: string; segments: Plan[] }>
      ).map((g) => ({
        ...g,
        segments: (g.segments || []).map((p: Plan) =>
          p.id === editingPlan.id
            ? {
                ...p,
                name: editPlanName.trim(),
                code:
                  editPlanCode.trim() ||
                  editPlanName.trim().toLowerCase().replace(/\s+/g, '_'),
                style: editPlanStyle,
                cameraType: editCameraType,
                activeLayers: editActiveLayers,
              }
            : p
        ),
      }));

      const updatedData = {
        ...data,
        groups: updatedGroups,
      };

      console.log('updatedData', updatedData);

      setData(updatedData);

      // Passar os dados atualizados diretamente para evitar problema de closure
      await saveToJson(updatedData);

      setEditingPlan(null);
      toast.success('Configuração salva no JSON!');
      return true;
    },
    [
      editPlanName,
      editPlanCode,
      editingPlan,
      editPlanStyle,
      editCameraType,
      editActiveLayers,
      data,
      setData,
      saveToJson,
    ]
  );

  return {
    editingPlan,
    editPlanName,
    editPlanCode,
    editPlanStyle,
    editCameraType,
    editActiveLayers,
    setEditPlanName,
    setEditPlanCode,
    setEditPlanStyle,
    setEditCameraType,
    setEditActiveLayers,
    openEditor,
    closeEditor,
    applyCurrentState,
    selectAllLayers,
    selectNoLayers,
    saveEdits,
  };
}
