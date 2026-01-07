'use client';

/**
 * State management hook for Sketchup entities
 * Provides centralized state with loading and busy indicators
 */

import { useState, useCallback } from 'react';

export interface UseSketchupStateOptions<TData> {
  initialData: TData;
  onDataChange?: (data: TData) => void;
}

export interface UseSketchupStateReturn<TData> {
  data: TData;
  setData: (data: TData | ((prev: TData) => TData)) => void;
  isBusy: boolean;
  setIsBusy: (busy: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  resetState: () => void;
}

/**
 * Hook for managing entity state with loading indicators
 */
export function useSketchupState<TData>(
  options: UseSketchupStateOptions<TData>
): UseSketchupStateReturn<TData> {
  const [data, setDataInternal] = useState<TData>(options.initialData);
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setData = useCallback(
    (newData: TData | ((prev: TData) => TData)) => {
      setDataInternal((prev) => {
        let nextData: TData;
        if (typeof newData === 'function') {
          // Type assertion needed because TData could be a function type
          nextData = (newData as (prev: TData) => TData)(prev);
        } else {
          nextData = newData;
        }
        options.onDataChange?.(nextData);
        return nextData;
      });
    },
    [options]
  );

  const resetState = useCallback(() => {
    setDataInternal(options.initialData);
    setIsBusy(false);
    setIsLoading(false);
  }, [options.initialData]);

  return {
    data,
    setData,
    isBusy,
    setIsBusy,
    isLoading,
    setIsLoading,
    resetState,
  };
}
