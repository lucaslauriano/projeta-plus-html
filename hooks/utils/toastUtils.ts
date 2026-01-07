/**
 * Toast notification utilities
 */

import { toast } from 'sonner';

/**
 * Shows a success toast with optional custom message
 */
export function showSuccess(message: string) {
  toast.success(message);
}

/**
 * Shows an error toast with optional custom message
 */
export function showError(message: string) {
  toast.error(message);
}

/**
 * Shows an info toast
 */
export function showInfo(message: string) {
  toast.info(message);
}

/**
 * Shows a warning toast
 */
export function showWarning(message: string) {
  toast.warning(message);
}

/**
 * Creates a toast object for handler context
 */
export function createToastContext() {
  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
  };
}

/**
 * Shows a loading toast that can be updated
 */
export function showLoading(message: string) {
  return toast.loading(message);
}

/**
 * Dismisses a specific toast
 */
export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

/**
 * Shows a promise toast (loading -> success/error)
 */
export function showPromiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  }
) {
  return toast.promise(promise, messages);
}
