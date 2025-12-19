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

export interface ViewConfig {
  id: string;
  name: string;
  style: string;
  cameraType: string;
  activeLayers: string[];
}

export interface BasePlan {
  id: string;
  name: string;
  style: string;
  activeLayers: string[];
}

export interface ViewConfigsData {
  groups?: unknown[];
  scenes?: ViewConfig[];
  plans?: ViewConfig[];
}

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
    _showSaveToast?: boolean;
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
      getElectricalBlocks: () => void;
      importElectricalBlock: (payload: string) => void;
      openElectricalBlocksFolder: () => void;
      exportElectricalReport: () => void;
      getLightningBlocks: () => void;
      importLightningBlock: (payload: string) => void;
      openLightningBlocksFolder: () => void;
      getBaseboardsBlocks: () => void;
      importBaseboardsBlock: (payload: string) => void;
      openBaseboardsBlocksFolder: () => void;
      getCustomComponents: () => void;
      uploadCustomComponent: (payload: string) => void;
      deleteCustomComponent: (payload: string) => void;
      openCustomComponentsFolder: () => void;
      syncCustomComponentsFolder: () => void;
      getScenes: () => void;
      addScene: (payload: string) => void;
      updateScene: (payload: string) => void;
      deleteScene: (payload: string) => void;
      applySceneConfig: (payload: string) => void;
      getAvailableStyles: () => void;
      getAvailableLayers: () => void;
      getVisibleLayers: () => void;
      getCurrentState: () => void;
      saveScenesToJson: (payload: string) => void;
      loadScenesFromJson: () => void;
      loadDefaultScenes: () => void;
      loadScenesFromFile: () => void;
      getPlans: () => void;
      addPlan: (payload: string) => void;
      updatePlan: (payload: string) => void;
      deletePlan: (payload: string) => void;
      applyPlanConfig: (payload: string) => void;
      getAvailableStylesPlans: () => void;
      getAvailableLayersPlans: () => void;
      getVisibleLayersPlans: () => void;
      getCurrentStatePlans: () => void;
      savePlansToJson: (payload: string) => void;
      loadPlansFromJson: () => void;
      loadDefaultPlans: () => void;
      loadPlansFromFile: () => void;
      getSections: () => void;
      addSection: (payload: string) => void;
      updateSection: (payload: string) => void;
      deleteSection: (payload: string) => void;
      createStandardSections: () => void;
      createAutoViews: () => void;
      createIndividualSection: (payload: string) => void;
      saveSectionsToJson: (payload: string) => void;
      loadSectionsFromJson: () => void;
      loadDefaultSections: () => void;
      loadSectionsFromFile: () => void;
      importSectionsToModel: (payload: string) => void;
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
    handleViewAnnotationResult?: (result: RoomAnnotationResult) => void;
    handleLightingDefaults?: (defaults: LightingDefaults) => void;
    handleLightingAnnotationResult?: (result: RoomAnnotationResult) => void;
    handleCircuitConnectionResult?: (result: RoomAnnotationResult) => void;
    handleCeilingDefaults?: (defaults: CeilingDefaults) => void;
    handleCeilingAnnotationResult?: (result: RoomAnnotationResult) => void;
    handleHeightDefaults?: (defaults: HeightDefaults) => void;
    handleEletricalAnnotationResult?: (result: RoomAnnotationResult) => void;
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
      folder?: { name: string };
    }) => void;
    handleAddTagResult?: (result: {
      success: boolean;
      message: string;
      tag?: SketchUpTag;
    }) => void;
    handleGetLayersResult?: (result: LayersData) => void;
    handleDeleteFolderResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleDeleteLayerResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleToggleVisibilityResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleUpdateTagColorResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleUpdateTagNameResult?: (result: {
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
    handleLoadDefaultTagsResult?: (
      result: LayersData & {
        success: boolean;
        message: string;
      }
    ) => void;
    handleLoadMyTagsResult?: (
      result: LayersData & {
        success: boolean;
        message: string;
      }
    ) => void;
    handleGetJsonPathResult?: (result: {
      success: boolean;
      path?: string;
    }) => void;
    handleGetElectricalBlocksResult?: (result: {
      success: boolean;
      message?: string;
      groups?: Array<{
        id: string;
        title: string;
        items: Array<{ id: string; name: string; path: string }>;
      }>;
      components_path?: string;
    }) => void;
    handleImportElectricalBlockResult?: (result: {
      success: boolean;
      message?: string;
      block_name?: string;
    }) => void;
    handleOpenElectricalFolderResult?: (result: {
      success: boolean;
      message?: string;
    }) => void;
    handleExportElectricalReportResult?: (result: {
      success: boolean;
      message?: string;
    }) => void;
    handleGetLightningBlocksResult?: (result: {
      success: boolean;
      message?: string;
      groups?: Array<{
        id: string;
        title: string;
        items: Array<{ id: string; name: string; path: string }>;
      }>;
      components_path?: string;
    }) => void;
    handleImportLightningBlockResult?: (result: {
      success: boolean;
      message?: string;
      block_name?: string;
    }) => void;
    handleOpenLightningFolderResult?: (result: {
      success: boolean;
      message?: string;
    }) => void;
    handleGetBaseboardsBlocksResult?: (result: {
      success: boolean;
      message?: string;
      groups?: Array<{
        id: string;
        title: string;
        items: Array<{ id: string; name: string; path: string }>;
      }>;
      components_path?: string;
    }) => void;
    handleImportBaseboardsBlockResult?: (result: {
      success: boolean;
      message?: string;
      block_name?: string;
    }) => void;
    handleOpenBaseboardsFolderResult?: (result: {
      success: boolean;
      message?: string;
    }) => void;
    handleGetCustomComponentsResult?: (result: {
      success: boolean;
      message?: string;
      groups?: Array<{
        id: string;
        title: string;
        items: Array<{
          id: string;
          name: string;
          path: string;
          source: string;
        }>;
        source: string;
      }>;
    }) => void;
    handleUploadCustomComponentResult?: (result: {
      success: boolean;
      message?: string;
      filename?: string;
      category?: string;
    }) => void;
    handleDeleteCustomComponentResult?: (result: {
      success: boolean;
      message?: string;
    }) => void;
    handleOpenCustomFolderResult?: (result: {
      success: boolean;
      message?: string;
    }) => void;
    handleSyncFolderResult?: (result: {
      success: boolean;
      message?: string;
      count?: number;
    }) => void;
    handleGetScenesResult?: (result: {
      success: boolean;
      message?: string;
      scenes?: ViewConfig[];
    }) => void;
    handleAddSceneResult?: (result: {
      success: boolean;
      message: string;
      scene?: ViewConfig;
    }) => void;
    handleUpdateSceneResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleDeleteSceneResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleApplySceneConfigResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleSaveScenesToJsonResult?: (result: {
      success: boolean;
      message: string;
      path?: string;
    }) => void;
    handleLoadScenesFromJsonResult?: (result: {
      success: boolean;
      message: string;
      data?: ViewConfigsData;
    }) => void;
    handleLoadDefaultScenesResult?: (result: {
      success: boolean;
      message: string;
      data?: ViewConfigsData;
    }) => void;
    handleLoadScenesFromFileResult?: (result: {
      success: boolean;
      message: string;
      data?: ViewConfigsData;
    }) => void;
    handleGetAvailableStylesResult?: (result: {
      success: boolean;
      message?: string;
      styles?: string[];
    }) => void;
    handleGetAvailableLayersResult?: (result: {
      success: boolean;
      message?: string;
      layers?: string[];
    }) => void;
    handleGetVisibleLayersResult?: (result: {
      success: boolean;
      message?: string;
      layers?: string[];
    }) => void;
    handleGetCurrentStateResult?: (result: {
      success: boolean;
      message?: string;
      style?: string;
      cameraType?: string;
      activeLayers?: string[];
    }) => void;
    handleGetPlansResult?: (result: {
      success: boolean;
      message?: string;
      plans?: ViewConfig[];
    }) => void;
    handleAddPlanResult?: (result: {
      success: boolean;
      message: string;
      plan?: ViewConfig;
    }) => void;
    handleUpdatePlanResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleDeletePlanResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleApplyPlanConfigResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleSavePlansToJsonResult?: (result: {
      success: boolean;
      message: string;
      path?: string;
    }) => void;
    handleLoadPlansFromJsonResult?: (result: {
      success: boolean;
      message: string;
      data?: ViewConfigsData;
    }) => void;
    handleLoadDefaultPlansResult?: (result: {
      success: boolean;
      message: string;
      data?: ViewConfigsData;
    }) => void;
    handleLoadPlansFromFileResult?: (result: {
      success: boolean;
      message: string;
      data?: ViewConfigsData;
    }) => void;
    handleGetAvailableStylesPlansResult?: (result: {
      success: boolean;
      message?: string;
      styles?: string[];
    }) => void;
    handleGetAvailableLayersPlansResult?: (result: {
      success: boolean;
      message?: string;
      layers?: string[];
    }) => void;
    handleGetVisibleLayersPlansResult?: (result: {
      success: boolean;
      message?: string;
      layers?: string[];
    }) => void;
    handleGetCurrentStatePlansResult?: (result: {
      success: boolean;
      message?: string;
      style?: string;
      cameraType?: string;
      activeLayers?: string[];
    }) => void;
    handleGetLevelsResult?: (result: {
      success: boolean;
      message?: string;
      levels?: Array<{
        number: number;
        height_meters: number;
        has_base: boolean;
        has_ceiling: boolean;
        name: string;
        base_cut_height: number;
        ceiling_cut_height: number;
      }>;
    }) => void;
    handleAddLevelResult?: (result: {
      success: boolean;
      message: string;
      level?: {
        number: number;
        height_meters: number;
        has_base: boolean;
        has_ceiling: boolean;
        name: string;
        base_cut_height: number;
        ceiling_cut_height: number;
      };
    }) => void;
    handleRemoveLevelResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleCreateBaseSceneResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleCreateCeilingSceneResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleGetBasePlansResult?: (result: {
      success: boolean;
      message?: string;
      plans?: Array<{
        id: string;
        name: string;
        style: string;
        activeLayers: string[];
      }>;
    }) => void;
    handleSaveBasePlansResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleGetAvailableStylesForBasePlansResult?: (result: {
      success: boolean;
      message?: string;
      styles?: string[];
    }) => void;
    handleGetAvailableLayersForBasePlansResult?: (result: {
      success: boolean;
      message?: string;
      layers?: string[];
    }) => void;
    handleCreateCarpentryDetailResult?: (result: {
      success: boolean;
      message: string;
      layer_name?: string;
    }) => void;
    handleCreateGeneralDetailsResult?: (result: {
      success: boolean;
      message: string;
      count?: number;
    }) => void;
    handleGetStylesResult?: (result: {
      success: boolean;
      message: string;
      styles?: string[];
    }) => void;
    handleDuplicateSceneResult?: (result: {
      success: boolean;
      message: string;
      scene_name?: string;
    }) => void;
    handleTogglePerspectiveResult?: (result: {
      success: boolean;
      message: string;
      angle_index?: number;
    }) => void;
    // Sections Module
    handleGetSectionsResult?: (result: {
      success: boolean;
      message?: string;
      sections?: Array<{
        id: string;
        name: string;
        position: [number, number, number];
        direction: [number, number, number];
        active: boolean;
      }>;
    }) => void;
    handleAddSectionResult?: (result: {
      success: boolean;
      message: string;
      section?: {
        id: string;
        name: string;
        position: [number, number, number];
        direction: [number, number, number];
        active: boolean;
      };
    }) => void;
    handleUpdateSectionResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleDeleteSectionResult?: (result: {
      success: boolean;
      message: string;
    }) => void;
    handleCreateStandardSectionsResult?: (result: {
      success: boolean;
      message: string;
      count?: number;
    }) => void;
    handleCreateAutoViewsResult?: (result: {
      success: boolean;
      message: string;
      count?: number;
    }) => void;
    handleCreateIndividualSectionResult?: (result: {
      success: boolean;
      message: string;
      section?: {
        id: string;
        name: string;
        position: [number, number, number];
        direction: [number, number, number];
        active: boolean;
      };
    }) => void;
    handleSaveSectionsToJsonResult?: (result: {
      success: boolean;
      message: string;
      path?: string;
    }) => void;
    handleLoadSectionsFromJsonResult?: (result: {
      success: boolean;
      message: string;
      data?: {
        sections: Array<{
          id: string;
          name: string;
          position: [number, number, number];
          direction: [number, number, number];
          active: boolean;
        }>;
      };
    }) => void;
    handleLoadDefaultSectionsResult?: (result: {
      success: boolean;
      message: string;
      data?: {
        sections: Array<{
          id: string;
          name: string;
          position: [number, number, number];
          direction: [number, number, number];
          active: boolean;
        }>;
      };
    }) => void;
    handleLoadSectionsFromFileResult?: (result: {
      success: boolean;
      message: string;
      data?: {
        sections: Array<{
          id: string;
          name: string;
          position: [number, number, number];
          direction: [number, number, number];
          active: boolean;
        }>;
      };
    }) => void;
    handleImportSectionsToModelResult?: (result: {
      success: boolean;
      message: string;
      count?: number;
    }) => void;
  }
}

export interface RubyResponse {
  success: boolean;
  message: string;
  path?: string;
  setting_key?: string;
  updated_value?: unknown;
}

// Annotation types moved to types/annotations.ts
export type {
  LightingDefaults,
  CeilingDefaults,
  HeightDefaults,
  ComponentUpdaterDefaults,
} from './annotations';

export interface SectionDefaults {
  line_height_cm: string;
  scale_factor: string;
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

export {};
