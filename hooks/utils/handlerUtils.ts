/**
 * Utility functions for handler management
 */

import type { HandlerConfig, HandlerContext, HandlerResult } from '../types';

/**
 * Creates a standard success handler
 */
export function createSuccessHandler<TData>(
  onSuccess?: (result: HandlerResult, ctx: HandlerContext<TData>) => void,
  defaultMessage = 'Operação realizada com sucesso'
) {
  return (result: HandlerResult, ctx: HandlerContext<TData>) => {
    ctx.setIsBusy(false);
    ctx.setIsLoading(false);

    if (result.success) {
      if (result.message) {
        ctx.toast.success(result.message);
      } else {
        ctx.toast.success(defaultMessage);
      }
      onSuccess?.(result, ctx);
    } else {
      ctx.toast.error(result.message || 'Erro na operação');
    }
  };
}

/**
 * Creates a standard error handler
 */
export function createErrorHandler<TData>(defaultMessage = 'Erro na operação') {
  return (result: HandlerResult, ctx: HandlerContext<TData>) => {
    ctx.setIsBusy(false);
    ctx.setIsLoading(false);
    ctx.toast.error(result.message || defaultMessage);
  };
}

/**
 * Creates a handler that updates data on success
 */
export function createDataUpdateHandler<TData>(
  dataKey: string,
  defaultMessage = 'Dados carregados com sucesso'
) {
  return (result: HandlerResult, ctx: HandlerContext<TData>) => {
    ctx.setIsBusy(false);
    ctx.setIsLoading(false);

    if (result.success && result[dataKey]) {
      ctx.setData(result[dataKey] as TData);
      if (result.message) {
        ctx.toast.success(result.message);
      }
    } else if (!result.success) {
      ctx.toast.error(result.message || defaultMessage);
    }
  };
}

/**
 * Creates a handler that reloads data after mutation
 */
export function createMutationHandler<TData>(
  reloadFn?: () => void,
  successMessage?: string
) {
  return (result: HandlerResult, ctx: HandlerContext<TData>) => {
    ctx.setIsBusy(false);

    if (result.success) {
      if (successMessage || result.message) {
        ctx.toast.success(result.message || successMessage!);
      }
      reloadFn?.();
    } else {
      ctx.toast.error(result.message || 'Erro na operação');
    }
  };
}

/**
 * Wraps a handler with loading state management
 */
export function withLoadingState<TData>(
  handler: (result: HandlerResult, ctx: HandlerContext<TData>) => void
) {
  return (result: HandlerResult, ctx: HandlerContext<TData>) => {
    ctx.setIsBusy(false);
    ctx.setIsLoading(false);
    handler(result, ctx);
  };
}

/**
 * Wraps a handler with error boundary
 */
export function withErrorBoundary<TData>(
  handler: (result: HandlerResult, ctx: HandlerContext<TData>) => void,
  fallbackMessage = 'Erro inesperado'
) {
  return (result: HandlerResult, ctx: HandlerContext<TData>) => {
    try {
      handler(result, ctx);
    } catch (error) {
      ctx.setIsBusy(false);
      ctx.setIsLoading(false);
      ctx.toast.error(fallbackMessage);
      console.error('Handler error:', error);
    }
  };
}

/**
 * Composes multiple handlers into one
 */
export function composeHandlers<TData>(
  ...handlers: Array<
    (result: HandlerResult, ctx: HandlerContext<TData>) => void
  >
) {
  return (result: HandlerResult, ctx: HandlerContext<TData>) => {
    handlers.forEach((handler) => handler(result, ctx));
  };
}

/**
 * Creates a conditional handler
 */
export function conditionalHandler<TData>(
  condition: (result: HandlerResult) => boolean,
  trueHandler: (result: HandlerResult, ctx: HandlerContext<TData>) => void,
  falseHandler?: (result: HandlerResult, ctx: HandlerContext<TData>) => void
) {
  return (result: HandlerResult, ctx: HandlerContext<TData>) => {
    if (condition(result)) {
      trueHandler(result, ctx);
    } else if (falseHandler) {
      falseHandler(result, ctx);
    }
  };
}
