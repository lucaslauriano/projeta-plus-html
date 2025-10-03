interface RoomAnnotationResult {
  success: boolean;
  message: string;
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

declare global {
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
