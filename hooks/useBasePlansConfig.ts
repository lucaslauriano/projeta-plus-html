'use client';

import { useState, useEffect, useRef } from 'react';

type BasePlansConfig = {
  base: {
    style: string;
    layers: string[];
    code?: string;
  };
  ceiling: {
    style: string;
    layers: string[];
    code?: string;
  };
};

type BasePlansData = {
  plans: Array<{
    id: string;
    style: string;
    activeLayers: string[];
    code?: string;
  }>;
};

export function useBasePlansConfig(
  basePlansData: BasePlansData,
  savePlans: (plans: unknown, showToast?: boolean) => Promise<void>
) {
  const [config, setConfig] = useState<BasePlansConfig>({
    base: { style: 'PRO_VISTAS', layers: ['Layer0'], code: 'base' },
    ceiling: { style: 'PRO_VISTAS', layers: ['Layer0'], code: 'ceiling' },
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savePlansRef = useRef(savePlans);

  // Atualizar referência de savePlans
  useEffect(() => {
    savePlansRef.current = savePlans;
  }, [savePlans]);

  // Inicializar a partir de basePlansData
  useEffect(() => {
    if (basePlansData.plans.length > 0 && !isInitialized) {
      const basePlan = basePlansData.plans.find((p) => p.id === 'base');
      const ceilingPlan = basePlansData.plans.find((p) => p.id === 'forro');

      if (basePlan || ceilingPlan) {
        setConfig((prev) => ({
          base: basePlan
            ? {
                style: basePlan.style,
                layers: basePlan.activeLayers,
                code: basePlan.code || 'base',
              }
            : prev.base,
          ceiling: ceilingPlan
            ? {
                style: ceilingPlan.style,
                layers: ceilingPlan.activeLayers,
                code: ceilingPlan.code || 'ceiling',
              }
            : prev.ceiling,
        }));
      }

      setIsInitialized(true);
    }
  }, [basePlansData, isInitialized]);

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
          code: config.base.code,
          style: config.base.style,
          activeLayers: config.base.layers,
        },
        {
          id: 'forro',
          name: 'Forro',
          code: config.ceiling.code,
          style: config.ceiling.style,
          activeLayers: config.ceiling.layers,
        },
      ];

      savePlansRef.current(plans, false);
    }, 100);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [config, isInitialized]);

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

  const updateBaseCode = (code: string) => {
    setConfig((prev) => ({
      ...prev,
      base: { ...prev.base, code },
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

  const updateCeilingCode = (code: string) => {
    setConfig((prev) => ({
      ...prev,
      ceiling: { ...prev.ceiling, code },
    }));
  };

  const saveConfig = async (showToast: boolean = false) => {
    const plans = [
      {
        id: 'base',
        name: 'Base',
        code: config.base.code,
        style: config.base.style,
        activeLayers: config.base.layers,
      },
      {
        id: 'forro',
        name: 'Forro',
        code: config.ceiling.code,
        style: config.ceiling.style,
        activeLayers: config.ceiling.layers,
      },
    ];

    await savePlans(plans, showToast);
  };

  return {
    baseStyle: config.base.style,
    baseLayers: config.base.layers,
    baseCode: config.base.code,
    ceilingStyle: config.ceiling.style,
    ceilingLayers: config.ceiling.layers,
    ceilingCode: config.ceiling.code,
    updateBaseStyle,
    updateBaseLayers,
    updateBaseCode,
    updateCeilingStyle,
    updateCeilingLayers,
    updateCeilingCode,
    saveConfig,
  };
}
