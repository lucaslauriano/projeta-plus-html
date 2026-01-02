'use client';

import { useState, useEffect, useRef } from 'react';

type BasePlansConfig = {
  base: {
    style: string;
    layers: string[];
  };
  ceiling: {
    style: string;
    layers: string[];
  };
};

type BasePlansData = {
  plans: Array<{
    id: string;
    style: string;
    activeLayers: string[];
  }>;
};

export function useBasePlansConfig(
  basePlansData: BasePlansData,
  savePlans: (plans: unknown, showToast?: boolean) => Promise<void>
) {
  const [config, setConfig] = useState<BasePlansConfig>({
    base: { style: 'PRO_VISTAS', layers: ['Layer0'] },
    ceiling: { style: 'PRO_VISTAS', layers: ['Layer0'] },
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar a partir de basePlansData
  useEffect(() => {
    if (basePlansData.plans.length > 0 && !isInitialized) {
      const basePlan = basePlansData.plans.find((p) => p.id === 'base');
      const ceilingPlan = basePlansData.plans.find((p) => p.id === 'forro');

      if (basePlan || ceilingPlan) {
        setConfig({
          base: basePlan
            ? { style: basePlan.style, layers: basePlan.activeLayers }
            : config.base,
          ceiling: ceilingPlan
            ? { style: ceilingPlan.style, layers: ceilingPlan.activeLayers }
            : config.ceiling,
        });
      }

      setIsInitialized(true);
    }
  }, [basePlansData, isInitialized, config.base, config.ceiling]);

  // Auto-save com debounce
  useEffect(() => {
    if (!isInitialized) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const plans = [
        {
          id: 'base',
          name: 'Base',
          style: config.base.style,
          activeLayers: config.base.layers,
        },
        {
          id: 'forro',
          name: 'Forro',
          style: config.ceiling.style,
          activeLayers: config.ceiling.layers,
        },
      ];

      savePlans(plans, false);
    }, 100);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [config, isInitialized, savePlans]);

  const updateBaseStyle = (style: string) => {
    setConfig((prev) => ({
      ...prev,
      base: { ...prev.base, style },
    }));
  };

  const updateBaseLayers = (layers: string[]) => {
    setConfig((prev) => ({
      ...prev,
      base: { ...prev.base, layers },
    }));
  };

  const updateCeilingStyle = (style: string) => {
    setConfig((prev) => ({
      ...prev,
      ceiling: { ...prev.ceiling, style },
    }));
  };

  const updateCeilingLayers = (layers: string[]) => {
    setConfig((prev) => ({
      ...prev,
      ceiling: { ...prev.ceiling, layers },
    }));
  };

  const saveConfig = async (showToast: boolean = false) => {
    const plans = [
      {
        id: 'base',
        name: 'Base',
        style: config.base.style,
        activeLayers: config.base.layers,
      },
      {
        id: 'forro',
        name: 'Forro',
        style: config.ceiling.style,
        activeLayers: config.ceiling.layers,
      },
    ];

    await savePlans(plans, showToast);
  };

  return {
    baseStyle: config.base.style,
    baseLayers: config.base.layers,
    ceilingStyle: config.ceiling.style,
    ceilingLayers: config.ceiling.layers,
    updateBaseStyle,
    updateBaseLayers,
    updateCeilingStyle,
    updateCeilingLayers,
    saveConfig,
  };
}
