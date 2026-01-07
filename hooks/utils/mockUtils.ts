/**
 * Mock data utilities for development mode
 */

/**
 * Creates a delay for simulating async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulates a successful Ruby method call
 */
export async function mockSuccess<T>(
  data: T,
  message = 'Operação realizada com sucesso',
  delayMs = 500
): Promise<{ success: true; data: T; message: string }> {
  await delay(delayMs);
  return { success: true, data, message };
}

/**
 * Simulates a failed Ruby method call
 */
export async function mockError(
  message = 'Erro na operação',
  delayMs = 500
): Promise<{ success: false; message: string }> {
  await delay(delayMs);
  return { success: false, message };
}

/**
 * Simulates a Ruby method call with random success/failure
 */
export async function mockRandom<T>(
  successData: T,
  successRate = 0.8,
  delayMs = 500
): Promise<
  | { success: true; data: T; message: string }
  | { success: false; message: string }
> {
  await delay(delayMs);
  const isSuccess = Math.random() < successRate;

  if (isSuccess) {
    return {
      success: true,
      data: successData,
      message: 'Operação realizada com sucesso',
    };
  } else {
    return {
      success: false,
      message: 'Erro simulado na operação',
    };
  }
}

/**
 * Creates mock handler that calls window callback
 */
export function createMockHandler<T>(
  handlerName: string,
  data: T,
  delayMs = 500
) {
  return async () => {
    await delay(delayMs);
    const handler = (window as unknown as Record<string, unknown>)[handlerName];
    if (typeof handler === 'function') {
      handler({ success: true, data, message: 'Mock data loaded' });
    }
  };
}

/**
 * Generates a random ID
 */
export function generateMockId(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates a mock entity with common fields
 */
export function createMockEntity<T extends Record<string, unknown>>(
  overrides: Partial<T> = {}
): T {
  return {
    id: generateMockId(),
    name: `Mock Entity ${Date.now()}`,
    ...overrides,
  } as unknown as T;
}

/**
 * Logs mock operations in development
 */
export function logMockOperation(
  operation: string,
  params?: unknown,
  result?: unknown
) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`[MOCK] ${operation}`);
    if (params) console.log('Params:', params);
    if (result) console.log('Result:', result);
    console.groupEnd();
  }
}

/**
 * Checks if we're in mock mode (no SketchUp available)
 */
export function isMockMode(): boolean {
  return typeof window !== 'undefined' && !window.sketchup;
}
