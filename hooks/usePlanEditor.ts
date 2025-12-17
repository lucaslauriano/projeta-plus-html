'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export type Plan = {
  id: string;
  title: string;
  segments: unknown[];
};

type PlanConfig = {
  id: string;
  name: string;
  style: string;
  cameraType: string;
  activeLayers: string[];
};

type PlansData = {
  groups: unknown[];
  plans: PlanConfig[];
};

export function usePlanEditor(
  data: { groups: unknown; plans: unknown[] },
  availableStyles: string[],
  availableLayers: string[],
  getCurrentState: () => Promise<void>,
  currentState: {
    style: string;
    cameraType: string;
    activeLayers: string[];
  } | null,
  setData: (data: unknown) => void,
  saveToJson: () => Promise<void>
) {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanStyle, setEditPlanStyle] = useState('');
  const [editCameraType, setEditCameraType] = useState('');
  const [editActiveLayers, setEditActiveLayers] = useState<string[]>([]);

  const openEditor = useCallback(
    (plan: Plan) => {
      setEditingPlan(plan);
      setEditPlanName(plan.title);

      const planConfig = (data.plans as PlanConfig[]).find(
        (p) => p.id === plan.id || p.name === plan.title
      );

      if (planConfig) {
        setEditPlanStyle(
          planConfig.style || availableStyles[0] || 'FM_PLANTAS'
        );
        setEditCameraType(planConfig.cameraType || 'topo_ortogonal');
        setEditActiveLayers(planConfig.activeLayers || ['Layer0']);
      } else {
        setEditPlanStyle(availableStyles[0] || 'FM_PLANTAS');
        setEditCameraType('topo_ortogonal');
        setEditActiveLayers(['Layer0']);
      }
    },
    [data.plans, availableStyles]
  );

  const closeEditor = useCallback(() => {
    setEditingPlan(null);
  }, []);

  const applyCurrentState = useCallback(async () => {
    await getCurrentState();
    if (currentState) {
      setEditPlanStyle(currentState.style);
      setEditCameraType(currentState.cameraType);
      setEditActiveLayers(currentState.activeLayers);
      toast.success('Estado atual aplicado!');
    }
  }, [getCurrentState, currentState]);

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

      const updatedPlans = (data.plans as PlanConfig[]).map((p) => {
        if (p.id === editingPlan.id || p.name === editingPlan.title) {
          return {
            ...p,
            name: editPlanName.trim(),
            style: editPlanStyle,
            cameraType: editCameraType,
            activeLayers: editActiveLayers,
          };
        }
        return p;
      });

      const planExists = (data.plans as PlanConfig[]).some(
        (p) => p.id === editingPlan.id || p.name === editingPlan.title
      );

      if (!planExists) {
        updatedPlans.push({
          id: editingPlan.id,
          name: editPlanName.trim(),
          style: editPlanStyle,
          cameraType: editCameraType,
          activeLayers: editActiveLayers,
        });
      }

      const updatedGroups = (
        groups as Array<{
          id: string;
          plans: Plan[];
        }>
      ).map((g) => ({
        ...g,
        plans: g.plans.map((p: Plan) =>
          p.id === editingPlan.id ? { ...p, title: editPlanName.trim() } : p
        ),
      }));

      setData({
        groups: updatedGroups,
        plans: updatedPlans,
      });

      await saveToJson();

      setEditingPlan(null);
      toast.success('Configuração salva no JSON!');
      return true;
    },
    [
      editPlanName,
      editingPlan,
      editPlanStyle,
      editCameraType,
      editActiveLayers,
      data.plans,
      setData,
      saveToJson,
    ]
  );

  return {
    editingPlan,
    editPlanName,
    editPlanStyle,
    editCameraType,
    editActiveLayers,
    setEditPlanName,
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
