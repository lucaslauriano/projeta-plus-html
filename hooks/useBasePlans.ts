'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export interface BasePlan {
  id: string;
  name: string;
  style: string;
  activeLayers: string[];
}

export interface BasePlansData {
  plans: BasePlan[];
}

export function useBasePlans() {
  const { callSketchupMethod, isAvailable } = useSketchup();
  const [data, setData] = useState<BasePlansData>({ plans: [] });
  const [availableStyles, setAvailableStyles] = useState<string[]>([]);
  const [availableLayers, setAvailableLayers] = useState<string[]>([]);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearPending = useCallback(() => {
    setPendingAction(null);
  }, []);

  // Load plans from JSON
  const loadPlans = useCallback(async () => {
    if (!isAvailable) return;
    setIsLoading(true);
    setPendingAction('load');
    await callSketchupMethod('getBasePlans');
  }, [callSketchupMethod, isAvailable]);

  // Get available styles from styles folder
  const getAvailableStyles = useCallback(async () => {
    if (!isAvailable) return;
    setIsLoading(true);
    await callSketchupMethod('getAvailableStylesForBasePlans');
  }, [callSketchupMethod, isAvailable]);

  // Get available layers from model
  const getAvailableLayers = useCallback(async () => {
    if (!isAvailable) return;
    setIsLoading(true);
    await callSketchupMethod('getAvailableLayersForBasePlans');
  }, [callSketchupMethod, isAvailable]);

  // Save plans to JSON
  const savePlans = useCallback(
    async (plans: BasePlan[], showToast: boolean = true) => {
      if (!isAvailable) {
        console.error('[useBasePlans] SketchUp não disponível');
        return;
      }
      setPendingAction('save');
      window._showSaveToast = showToast;
      await callSketchupMethod('saveBasePlans', { plans });
    },
    [callSketchupMethod, isAvailable]
  );

  // Handlers for responses from Ruby/SketchUp
  useEffect(() => {
    // Handler for loading plans
    window.handleGetBasePlansResult = (result: {
      success: boolean;
      message?: string;
      plans?: BasePlan[];
    }) => {
      clearPending();
      setIsLoading(false);
      if (result.success && result.plans) {
        setData({ plans: result.plans });
      } else {
        toast.error(
          result.message || 'Erro ao carregar configurações das plantas'
        );
      }
    };

    // Handler for available styles
    window.handleGetAvailableStylesForBasePlansResult = (result: {
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

    // Handler for available layers
    window.handleGetAvailableLayersForBasePlansResult = (result: {
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

    // Handler for saving plans
    window.handleSaveBasePlansResult = (result: {
      success: boolean;
      message: string;
    }) => {
      clearPending();
      const showToast = window._showSaveToast !== false;
      delete window._showSaveToast;

      if (result.success) {
        if (showToast) {
          toast.success(result.message);
        }
        // Recarregar dados após salvar
        loadPlans();
      } else {
        toast.error(result.message);
      }
    };

    // Cleanup
    return () => {
      if (window.handleGetBasePlansResult) {
        delete window.handleGetBasePlansResult;
      }
      if (window.handleGetAvailableStylesForBasePlansResult) {
        delete window.handleGetAvailableStylesForBasePlansResult;
      }
      if (window.handleGetAvailableLayersForBasePlansResult) {
        delete window.handleGetAvailableLayersForBasePlansResult;
      }
      if (window.handleSaveBasePlansResult) {
        delete window.handleSaveBasePlansResult;
      }
    };
  }, [clearPending]);

  // Load initial data
  useEffect(() => {
    if (isAvailable) {
      loadPlans();
      getAvailableStyles();
      getAvailableLayers();
    }
  }, [isAvailable, loadPlans, getAvailableStyles, getAvailableLayers]);

  const isBusy = isAvailable && (isLoading || Boolean(pendingAction));

  return {
    data,
    isBusy,
    isLoading,
    isAvailable,
    availableStyles,
    availableLayers,
    loadPlans,
    savePlans,
    getAvailableStyles,
    getAvailableLayers,
  };
}
