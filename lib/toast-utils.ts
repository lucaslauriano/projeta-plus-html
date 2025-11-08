import { toast, type ToastOptions, type Id } from 'react-toastify';

// Armazena os últimos toasts exibidos com timestamp
const toastCache = new Map<string, { id: Id; timestamp: number }>();

// Tempo mínimo entre toasts duplicados (em ms)
const TOAST_DEBOUNCE_TIME = 3000; // 3 segundos

/**
 * Exibe um toast, mas previne duplicatas dentro de um período de tempo
 */
export const toastWithDebounce = {
  error: (message: string, options?: ToastOptions) => {
    const now = Date.now();
    const cached = toastCache.get(message);

    // Se já existe um toast com essa mensagem e foi exibido recentemente, não exibe outro
    if (cached && now - cached.timestamp < TOAST_DEBOUNCE_TIME) {
      console.log(`Toast duplicado prevenido: "${message}"`);
      return cached.id;
    }

    // Exibe o toast e armazena no cache
    const id = toast.error(message, options);
    toastCache.set(message, { id, timestamp: now });

    // Remove do cache após o tempo de debounce
    setTimeout(() => {
      toastCache.delete(message);
    }, TOAST_DEBOUNCE_TIME);

    return id;
  },

  success: (message: string, options?: ToastOptions) => {
    const now = Date.now();
    const cached = toastCache.get(message);

    if (cached && now - cached.timestamp < TOAST_DEBOUNCE_TIME) {
      console.log(`Toast duplicado prevenido: "${message}"`);
      return cached.id;
    }

    const id = toast.success(message, options);
    toastCache.set(message, { id, timestamp: now });

    setTimeout(() => {
      toastCache.delete(message);
    }, TOAST_DEBOUNCE_TIME);

    return id;
  },

  info: (message: string, options?: ToastOptions) => {
    const now = Date.now();
    const cached = toastCache.get(message);

    if (cached && now - cached.timestamp < TOAST_DEBOUNCE_TIME) {
      console.log(`Toast duplicado prevenido: "${message}"`);
      return cached.id;
    }

    const id = toast.info(message, options);
    toastCache.set(message, { id, timestamp: now });

    setTimeout(() => {
      toastCache.delete(message);
    }, TOAST_DEBOUNCE_TIME);

    return id;
  },

  warning: (message: string, options?: ToastOptions) => {
    const now = Date.now();
    const cached = toastCache.get(message);

    if (cached && now - cached.timestamp < TOAST_DEBOUNCE_TIME) {
      console.log(`Toast duplicado prevenido: "${message}"`);
      return cached.id;
    }

    const id = toast.warning(message, options);
    toastCache.set(message, { id, timestamp: now });

    setTimeout(() => {
      toastCache.delete(message);
    }, TOAST_DEBOUNCE_TIME);

    return id;
  },
};

/**
 * Limpa o cache de toasts (útil para testes ou reset manual)
 */
export const clearToastCache = () => {
  toastCache.clear();
};

