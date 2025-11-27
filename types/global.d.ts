interface RoomAnnotationResult {
  success: boolean;
  message: string;
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

interface FurnitureDimensionsResponse {
  success: boolean;
  width?: string;
  depth?: string;
  height?: string;
  message?: string;
}

interface FurnitureDimensionPreviewResponse {
  success: boolean;
  dimension?: string;
  message?: string;
}

interface FurnitureOperationResponse {
  success: boolean;
  message: string;
  path?: string;
}

export interface FurnitureReportItem {
  name: string;
  color: string;
  brand: string;
  type: string;
  dimension: string;
  environment: string;
  observations: string;
  link: string;
  value: string;
  quantity: number;
  ids: number[];
}

interface FurnitureReportResponse {
  success: boolean;
  items: FurnitureReportItem[];
  message?: string;
}

export interface RoomDefaults {
  scale?: string;
  font?: string;
  floor_height?: string;
  show_ceilling_height?: boolean;
  ceilling_height?: string;
  show_level?: boolean;
  is_auto_level?: boolean;
  level?: string;
}
export interface SketchUpTag {
  name: string;
  visible: boolean;
  color: number[];
}

export interface SketchUpFolder {
  name: string;
  tags: SketchUpTag[];
}

export interface LayersData {
  folders: SketchUpFolder[];
  tags: SketchUpTag[];
}

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      plan?: 'free' | 'premium' | 'pro_user';
    };
  }

  interface UserPublicMetadata {
    plan?: 'free' | 'premium' | 'pro_user';
  }

  interface Window {
    sketchup: {
      requestAllSettings: () => void;
      loadRoomAnnotationDefaults: () => void;
      startSectionAnnotation: (args: string) => void;
      executeExtensionFunction: (payload: string) => void;
      loadGlobalSettings: () => void;
      changeLanguage: (langCode: string) => void;
      updateSetting: (payload: string) => void;
      selectFolderPath: (payload: string) => void;
      startRoomAnnotation: (args: RoomAnnotationArgs) => void;
      showMessageBox: (message: string) => void;
      requestModelName: () => void;
      getLayers: () => void;
      getJsonPath: () => void;
      deleteLayer: (name: string) => void;
      toggleVisibility: (payload: string) => void;
      saveToJson: (payload: string) => void;
      loadFromFile: () => void;
      importLayers: (payload: string) => void;
    };
    changeLanguage: (langCode: string) => void;
    loadGlobalSettings: () => void;
    handleGlobalSettings: (settings: GlobalSettings) => void;
    languageChanged: (langCode: string) => void;
    handleRubyResponse: (response: RubyResponse) => void;
    handleSettingUpdate?: (response: RubyResponse) => void;
    handleFolderSelection?: (response: RubyResponse) => void;
    handleRoomDefaults: (defaults: RoomDefaults) => void;
    receiveModelNameFromRuby?: (modelName: string) => void;
    receiveAllSettingsFromRuby?: (settings: GlobalSettings) => void;
    handleRoomAnnotationResult?: (result: RoomAnnotationResult) => void;
    handleSectionAnnotationResult?: (result: RoomAnnotationResult) => void;
    handleViewIndicationResult?: (result: RoomAnnotationResult) => void;
    handleLightingDefaults?: (defaults: LightingDefaults) => void;
    handleLightingAnnotationResult?: (result: RoomAnnotationResult) => void;
    handleCircuitConnectionResult?: (result: RoomAnnotationResult) => void;
    handleCeilingDefaults?: (defaults: CeilingDefaults) => void;
    handleCeilingAnnotationResult?: (result: RoomAnnotationResult) => void;
    handleHeightDefaults?: (defaults: HeightDefaults) => void;
    handleHeightAnnotationResult?: (result: RoomAnnotationResult) => void;
    handleComponentUpdaterDefaults?: (
      defaults: ComponentUpdaterDefaults
    ) => void;
    handleComponentUpdaterResult?: (result: RoomAnnotationResult) => void;
    handleFurnitureAttributes?: (response: FurnitureAttributesResponse) => void;
    handleFurnitureSave?: (response: FurnitureOperationResponse) => void;
    handleFurnitureDimensions?: (response: FurnitureDimensionsResponse) => void;
    handleFurnitureDimensionPreview?: (
      response: FurnitureDimensionPreviewResponse
    ) => void;
    handleFurnitureTypes?: (response: {
      success: boolean;
      types: string[];
      message?: string;
    }) => void;
    handleFurnitureReport?: (response: FurnitureReportResponse) => void;
    handleFurnitureOperation?: (response: FurnitureOperationResponse) => void;
    handleImportLayersResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleAddLayerResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleAddFolderResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleGetLayersResult?: (result: LayersData) => void;
    handleDeleteLayerResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleToggleVisibilityResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleSaveToJsonResult?: (result: {
      success: boolean;
      message: string;
      path?: string;
    }) => void;
    handleLoadFromFileResult?: (
      result: LayersData & {
        success: boolean;
        message: string;
      }
    ) => void;
    handleGetJsonPathResult?: (result: {
      success: boolean;
      path?: string;
    }) => void;
  }
}

export {};

// types.d.ts
export interface RubyResponse {
  success: boolean;
  message: string;
  path?: string;
  setting_key?: string;
  updated_value?: unknown;
}

export interface SectionDefaults {
  line_height_cm: string;
  scale_factor: string;
}

export interface LightingDefaults {
  circuit_text: string;
  circuit_scale: number;
  circuit_height_cm: number;
  circuit_font: string;
  circuit_text_color: string;
}

export interface CeilingDefaults {
  floor_level: string;
}

export interface HeightDefaults {
  scale: number;
  height_z_cm: string;
  font: string;
  show_usage: boolean;
}

export interface ComponentUpdaterDefaults {
  last_attribute: string;
  last_value: string;
  last_situation_type: string;
}

export interface LanguageOption {
  code: string; // e.g., "en", "pt-BR"
  name: string; // e.g., "English", "Português (Brasil)"
}

export interface GlobalSettings {
  font: string;
  measurement_unit: string;
  area_unit: string;
  scale_numerator: number;
  scale_denominator: number;
  floor_level: number;
  cut_height: number;
  headroom_height: number;
  styles_folder: string;
  sheets_folder: string;
  language: string; // NOVO: idioma selecionado
  frontend_options: {
    fonts: string[];
    measurement_units: string[];
    area_units: string[];
    languages: LanguageOption[]; // NOVO: opções de idioma
  };
}
