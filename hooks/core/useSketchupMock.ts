'use client';

/**
 * Mock mode utilities for development without SketchUp
 */

import { useCallback } from 'react';
import { delay, logMockOperation } from '../utils/mockUtils';

export interface UseSketchupMockOptions<TData> {
  mockData?: Partial<TData>;
  mockDelay?: number;
  enableLogging?: boolean;
}

export interface UseSketchupMockReturn {
  isMockMode: boolean;
  callMockMethod: <T>(
    method: string,
    params?: unknown,
    mockResult?: T
  ) => Promise<void>;
  getMockData: <T>(key: string, fallback: T) => T;
}

/**
 * Hook for handling mock mode (development without SketchUp)
 */
export function useSketchupMock<TData>(
  options: UseSketchupMockOptions<TData> = {}
): UseSketchupMockReturn {
  const { mockData = {}, mockDelay = 500, enableLogging = true } = options;

  const isMockMode =
    typeof window !== 'undefined' &&
    !(window as unknown as Record<string, unknown>).sketchup;

  const callMockMethod = useCallback(
    async <T>(method: string, params?: unknown, mockResult?: T) => {
      if (!isMockMode) return;

      if (enableLogging) {
        logMockOperation(method, params, mockResult);
      }

      await delay(mockDelay);

      // Try to find and call the corresponding handler
      const handlerName = `handle${method
        .charAt(0)
        .toUpperCase()}${method.slice(1)}Result`;
      const handler = (window as unknown as Record<string, unknown>)[
        handlerName
      ];

      if (typeof handler === 'function') {
        handler({
          success: true,
          data: mockResult,
          message: `Mock: ${method} executado`,
          ...mockResult,
        });
      }
    },
    [isMockMode, mockDelay, enableLogging]
  );

  const getMockData = useCallback(
    <T>(key: string, fallback: T): T => {
      if (!isMockMode) return fallback;
      return ((mockData as Record<string, unknown>)[key] as T) ?? fallback;
    },
    [isMockMode, mockData]
  );

  return {
    isMockMode,
    callMockMethod,
    getMockData,
  };
}
