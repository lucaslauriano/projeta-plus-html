/**
 * Core configuration types for Sketchup entity hooks
 */

export interface RubyMethodsConfig {
  get?: string;
  add?: string;
  update?: string;
  delete?: string;
  saveToJson?: string;
  loadFromJson?: string;
  loadDefault?: string;
  loadFromFile?: string;
  import?: string;
  export?: string;
  [key: string]: string | undefined;
}

export interface CustomMethodConfig {
  rubyMethod: string;
  params?: string[];
  validate?: (params: Record<string, unknown>) => string | undefined;
  successMessage?: string | ((result: unknown) => string);
  errorMessage?: string | ((result: unknown) => string);
  reloadAfter?: boolean;
  showToast?: boolean;
}

export interface ValidatorFn {
  (value: unknown): string | undefined;
}

export interface TransformerFn<T = unknown> {
  (value: unknown): T;
}

export interface EntityConfig<TData = unknown, TMethods = RubyMethodsConfig> {
  // Identification
  entityName: string;
  entityNameSingular?: string;

  // Initial state
  initialData: TData;

  // Ruby methods mapping
  methods: TMethods;

  // Handlers configuration
  handlers: HandlerConfig<TData>;

  // Mock data for development
  mockData?: Partial<TData>;

  // Custom methods beyond CRUD
  customMethods?: Record<string, CustomMethodConfig>;

  // Validators for operations
  validators?: Record<string, ValidatorFn>;

  // Data transformers
  transformers?: Record<string, TransformerFn>;

  // Auto-load on mount
  autoLoad?: boolean;

  // Auto-reload after mutations
  autoReload?: boolean;
}

export interface HandlerConfig<TData = unknown> {
  // Standard CRUD handlers
  onGet?: (result: HandlerResult, ctx: HandlerContext<TData>) => void;
  onAdd?: (result: HandlerResult, ctx: HandlerContext<TData>) => void;
  onUpdate?: (result: HandlerResult, ctx: HandlerContext<TData>) => void;
  onDelete?: (result: HandlerResult, ctx: HandlerContext<TData>) => void;

  // JSON persistence handlers
  onSaveToJson?: (result: HandlerResult, ctx: HandlerContext<TData>) => void;
  onLoadFromJson?: (result: HandlerResult, ctx: HandlerContext<TData>) => void;
  onLoadDefault?: (result: HandlerResult, ctx: HandlerContext<TData>) => void;
  onLoadFromFile?: (result: HandlerResult, ctx: HandlerContext<TData>) => void;

  // Import/Export handlers
  onImport?: (result: HandlerResult, ctx: HandlerContext<TData>) => void;
  onExport?: (result: HandlerResult, ctx: HandlerContext<TData>) => void;

  // Custom handlers
  [key: string]:
    | ((result: HandlerResult, ctx: HandlerContext<TData>) => void)
    | undefined;
}

export interface HandlerResult {
  success: boolean;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

export interface HandlerContext<TData = unknown> {
  setData: (data: TData | ((prev: TData) => TData)) => void;
  setIsBusy: (busy: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  isAvailable: boolean;
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
  };
}
