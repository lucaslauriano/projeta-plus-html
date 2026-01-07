export interface AnnotationArgs {
  [key: string]: string | boolean | number | undefined;
}

export interface RoomAnnotationArgs extends AnnotationArgs {
  enviroment_name: string;
  show_ceilling_height: boolean;
  ceilling_height: string;
  show_level: boolean;
  is_auto_level: boolean;
  level_value: string;
}

export interface CeilingAnnotationArgs extends AnnotationArgs {
  ceiling_height: string;
  show_level: boolean;
  is_auto_level: boolean;
  level_value: string;
}

export interface EletricalAnnotationArgs extends AnnotationArgs {
  height_value: string;
  prefix?: string;
  suffix?: string;
}

export interface LightingAnnotationArgs extends AnnotationArgs {
  lighting_type: string;
  quantity: number;
  observations?: string;
}

export interface SectionAnnotationArgs extends AnnotationArgs {
  section_name: string;
  scale?: string;
}

export interface AnnotationResult {
  success: boolean;
  message: string;
  [key: string]: unknown;
}

export type ComponentUpdaterDefaults = {
  last_attribute: string;
  last_value: string;
  last_situation_type: string;
};

export type ComponentUpdaterArgs = {
  attribute_type: string;
  new_value: string;
  situation_type: string;
};
