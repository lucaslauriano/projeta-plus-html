import { toast } from 'sonner';

/**
 * Response structure from SketchUp Ruby callbacks
 */
interface SketchupResponse {
  success: boolean;
  message: string;
}

/**
 * Extends Window interface to include dynamic annotation handlers
 */
declare global {
  interface Window {
    [key: string]: unknown;
  }
}

/**
 * Creates a standardized handler for annotation results
 * Shows success/error toast based on response
 */
export function createResultHandler(
  onSuccess?: (response: SketchupResponse) => void,
  onError?: (response: SketchupResponse) => void
) {
  return (response: SketchupResponse) => {
    if (response.success) {
      toast.success(response.message);
      onSuccess?.(response);
    } else {
      toast.error(response.message);
      onError?.(response);
    }
  };
}

/**
 * Registers multiple annotation handlers on window object
 *
 * @param handlers - Record of handler names and their implementations
 *   - Pass `true` to auto-generate a standard result handler with toast
 *   - Pass a custom function for specific behavior
 *
 * @returns Cleanup function to remove all registered handlers
 *
 * @example
 * ```ts
 * const cleanup = registerHandlers({
 *   handleRoomAnnotationResult: true, // Auto-generates toast handler
 *   handleCeilingDefaults: (response) => setDefaults(response), // Custom
 * });
 * ```
 */
export function registerHandlers(
  handlers: Record<string, ((response: SketchupResponse) => void) | true>
) {
  // Register handlers
  Object.entries(handlers).forEach(([name, handler]) => {
    // If true, create standard handler automatically
    const finalHandler = handler === true ? createResultHandler() : handler;

    window[name] = finalHandler;
  });

  // Return cleanup function
  return () => {
    Object.keys(handlers).forEach((name) => {
      delete window[name];
    });
  };
}
