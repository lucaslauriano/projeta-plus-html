'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useSketchup } from '@/contexts/SketchupContext';
import type { FurnitureReportItem } from '@/types/global';

export interface FurnitureFormPayload {
  entity_id?: number;
  name: string;
  color: string;
  brand: string;
  type: string;
  dimension_format: string;
  dimension: string;
  environment: string;
  value: string;
  link: string;
  observations: string;
  width: string;
  depth: string;
  height: string;
}

export interface FurnitureDimensions {
  width: string;
  depth: string;
  height: string;
}

export interface FurnitureData
  extends FurnitureFormPayload,
    FurnitureDimensions {
  selected: boolean;
}

interface FurnitureAttributesResponse {
  success: boolean;
  selected: boolean;
  entity_id?: number;
  name?: string;
  color?: string;
  brand?: string;
  type?: string;
  width?: string;
  depth?: string;
  height?: string;
  dimension_format?: string;
  dimension?: string;
  environment?: string;
  value?: string;
  link?: string;
  observations?: string;
  message?: string;
}

export function useFurniture() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();
  const [attributes, setAttributes] = useState<FurnitureData | null>(null);
  const [dimensions, setDimensions] = useState<FurnitureDimensions | null>(
    null
  );
  const [dimensionPreview, setDimensionPreview] = useState<string>('');
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [reportItems, setReportItems] = useState<FurnitureReportItem[]>([]);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const clearPending = useCallback(() => {
    console.log('[useFurniture] Clearing pending action');
    setPendingAction(null);
  }, []);

  useEffect(() => {
    console.log('[useFurniture] Pending action changed:', pendingAction);
  }, [pendingAction]);

  const handleError = useCallback((message?: string) => {
    if (message) {
      toast.error(message);
      setLastOperation(message);
    }
  }, []);

  useEffect(() => {
    window.handleFurnitureAttributes = (
      response: FurnitureAttributesResponse
    ) => {
      console.log(
        '\n[useFurniture] =========================================='
      );
      console.log('[useFurniture] handleFurnitureAttributes called');
      console.log('[useFurniture] Response:', response);
      console.log('[useFurniture] Success:', response.success);
      console.log('[useFurniture] Selected:', response.selected);

      clearPending();
      if (!response.success) {
        console.log('[useFurniture] ❌ Failed - clearing attributes');

        setAttributes(null);
        setDimensions(null);
        return;
      }

      console.log('[useFurniture] Raw dimensions from response:', {
        width: response.width,
        depth: response.depth,
        height: response.height,
      });

      const nextAttributes: FurnitureData = {
        selected: response.selected ?? false,
        entity_id: response.entity_id,
        name: response.name ?? '',
        color: response.color ?? '',
        brand: response.brand ?? '',
        type: response.type ?? '',
        dimension_format: response.dimension_format ?? 'L x D x H',
        dimension: response.dimension ?? '',
        environment: response.environment ?? '',
        value: response.value ?? '',
        link: response.link ?? '',
        observations: response.observations ?? '',
        width: response.width ?? '',
        depth: response.depth ?? '',
        height: response.height ?? '',
      };

      console.log('[useFurniture] ✅ Setting attributes:', nextAttributes);
      console.log('[useFurniture] Dimensions in nextAttributes:', {
        width: nextAttributes.width,
        depth: nextAttributes.depth,
        height: nextAttributes.height,
      });
      setAttributes(nextAttributes);
      setDimensions({
        width: nextAttributes.width,
        depth: nextAttributes.depth,
        height: nextAttributes.height,
      });
      console.log('[useFurniture] Dimensions state updated');
      setDimensionPreview(nextAttributes.dimension);
      console.log(
        '[useFurniture] ==========================================\n'
      );
    };

    window.handleFurnitureSave = (response) => {
      console.log('[useFurniture] handleFurnitureSave called', response);
      clearPending();
      if (response.success) {
        toast.success(response.message);
        setLastOperation(response.message);
        // Limpa os atributos após salvar com sucesso
        setAttributes(null);
        setDimensions(null);
        setDimensionPreview('');
      } else {
        handleError(response.message);
      }
    };

    window.handleFurnitureDimensions = (response) => {
      clearPending();
      if (!response.success) {
        handleError(response.message);
        return;
      }

      const nextDimensions: FurnitureDimensions = {
        width: response.width ?? '',
        depth: response.depth ?? '',
        height: response.height ?? '',
      };

      setDimensions(nextDimensions);
    };

    window.handleFurnitureDimensionPreview = (response) => {
      clearPending();
      if (!response.success) {
        handleError(response.message);
        return;
      }
      setDimensionPreview(response.dimension ?? '');
    };

    window.handleFurnitureTypes = (response) => {
      clearPending();
      if (!response.success) {
        handleError(response.message);
        return;
      }
      setAvailableTypes(response.types ?? []);
    };

    window.handleFurnitureReport = (response) => {
      clearPending();
      if (!response.success) {
        handleError(response.message);
        return;
      }
      setReportItems(response.items ?? []);
    };

    window.handleFurnitureOperation = (response) => {
      clearPending();
      if (response.success) {
        toast.success(response.message);
        setLastOperation(response.message);
      } else {
        handleError(response.message);
      }
    };

    return () => {
      delete window.handleFurnitureAttributes;
      delete window.handleFurnitureSave;
      delete window.handleFurnitureDimensions;
      delete window.handleFurnitureDimensionPreview;
      delete window.handleFurnitureTypes;
      delete window.handleFurnitureReport;
      delete window.handleFurnitureOperation;
    };
  }, [callSketchupMethod, clearPending, handleError]);

  const loadFurnitureTypes = useCallback(async () => {
    if (!isAvailable) return;
    setPendingAction('types');
    await callSketchupMethod('get_furniture_types');
  }, [callSketchupMethod, isAvailable]);

  const loadFurnitureAttributes = useCallback(async () => {
    if (!isAvailable) return;
    console.log('[useFurniture] Loading furniture attributes...');
    setPendingAction('load');
    await Promise.all([
      callSketchupMethod('get_furniture_attributes'),
      callSketchupMethod('get_dimensions'),
      loadFurnitureTypes(),
    ]);
  }, [callSketchupMethod, isAvailable, loadFurnitureTypes]);

  const saveFurnitureAttributes = useCallback(
    async (payload: FurnitureFormPayload) => {
      if (!isAvailable) return;
      console.log('[useFurniture] Saving furniture attributes...', payload);
      setPendingAction('save');
      await callSketchupMethod(
        'save_furniture_attributes',
        payload as unknown as Record<string, unknown>
      );
    },
    [callSketchupMethod, isAvailable]
  );

  const resizeProportional = useCallback(
    async (scaleFactor: number) => {
      if (!isAvailable) return;
      setPendingAction('resize');
      await callSketchupMethod('resize_proportional', {
        scale_factor: scaleFactor,
      });
    },
    [callSketchupMethod, isAvailable]
  );

  const resizeIndependent = useCallback(
    async (payload: FurnitureDimensions) => {
      if (!isAvailable) return;
      setPendingAction('resize');
      await callSketchupMethod(
        'resize_independent',
        payload as unknown as Record<string, unknown>
      );
    },
    [callSketchupMethod, isAvailable]
  );

  const resizeIndependentLive = useCallback(
    async (payload: FurnitureDimensions) => {
      if (!isAvailable) return;
      // Não usa setPendingAction para não bloquear a UI
      await callSketchupMethod(
        'resize_independent_live',
        payload as unknown as Record<string, unknown>
      );
    },
    [callSketchupMethod, isAvailable]
  );

  const requestDimensionPreview = useCallback(
    async (payload: {
      width: string;
      depth: string;
      height: string;
      dimension_format: string;
    }) => {
      if (!isAvailable) return;
      setPendingAction('dimension_preview');
      await callSketchupMethod(
        'calculate_dimension_string',
        payload as unknown as Record<string, unknown>
      );
    },
    [callSketchupMethod, isAvailable]
  );

  const isolateSelection = useCallback(
    async (entityId?: number) => {
      if (!entityId) {
        toast.warn('Nenhum componente selecionado.');
        return;
      }
      if (!isAvailable) return;
      setPendingAction('isolate');
      await callSketchupMethod('isolate_furniture_item', {
        entity_id: entityId,
      });
    },
    [callSketchupMethod, isAvailable]
  );

  const exportCategoryCsv = useCallback(
    async (category: string) => {
      if (!isAvailable) return;
      setPendingAction('export');
      await callSketchupMethod('export_furniture_category_csv', { category });
    },
    [callSketchupMethod, isAvailable]
  );

  const exportFurnitureXlsx = useCallback(
    async (categories: string[]) => {
      if (!isAvailable) return;
      setPendingAction('export');
      await callSketchupMethod('export_furniture_xlsx', { categories });
    },
    [callSketchupMethod, isAvailable]
  );

  const requestReport = useCallback(
    async (category: string) => {
      if (!isAvailable) return;
      setPendingAction('report');
      await callSketchupMethod('get_category_report_data', { category });
    },
    [callSketchupMethod, isAvailable]
  );

  const resetForm = useCallback(() => {
    setAttributes(null);
    setDimensions(null);
    setDimensionPreview('');
  }, []);

  const captureSelectedComponent = useCallback(async () => {
    if (!isAvailable) return;
    console.log('[useFurniture] Capturing selected component...');
    setPendingAction('capture');
    await callSketchupMethod('capture_selected_component');
  }, [callSketchupMethod, isAvailable]);

  const typeOptions = useMemo(
    () => (availableTypes.length ? availableTypes : []),
    [availableTypes]
  );

  const busy = isAvailable && (isLoading || Boolean(pendingAction));

  useEffect(() => {
    console.log('[useFurniture] Busy state:', {
      busy,
      isAvailable,
      isLoading,
      pendingAction,
    });
  }, [busy, isAvailable, isLoading, pendingAction]);

  return {
    attributes,
    dimensions,
    dimensionPreview,
    availableTypes: typeOptions,
    reportItems,
    lastOperation,
    isBusy: busy,
    isLoading,
    isAvailable,
    loadFurnitureAttributes,
    saveFurnitureAttributes,
    resizeProportional,
    resizeIndependent,
    resizeIndependentLive,
    requestDimensionPreview,
    isolateSelection,
    exportCategoryCsv,
    exportFurnitureXlsx,
    requestReport,
    resetForm,
    captureSelectedComponent,
  };
}
