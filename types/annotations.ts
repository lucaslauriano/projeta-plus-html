/**
 * Annotation types
 * Centralized type definitions for all annotation operations
 */

export interface AnnotationArgs {
  [key: string]: string | boolean | number | undefined;
}

export interface AnnotationResult {
  success: boolean;
  message: string;
  [key: string]: unknown;
}

// ============================================================================
// ROOM ANNOTATION
// ============================================================================

export interface RoomAnnotationArgs extends AnnotationArgs {
  enviroment_name: string;
  show_ceilling_height: boolean;
  ceilling_height: string;
  show_level: boolean;
  is_auto_level: boolean;
  level_value: string;
}

// ============================================================================
// CEILING ANNOTATION
// ============================================================================

export interface CeilingAnnotationArgs extends AnnotationArgs {
  ceiling_height: string;
  show_level: boolean;
  is_auto_level: boolean;
  level_value: string;
}

export interface CeilingDefaults {
  floor_level: string;
}

// ============================================================================
// HEIGHT ANNOTATION
// ============================================================================

export interface EletricalAnnotationArgs extends AnnotationArgs {
  height_value: string;
  prefix?: string;
  suffix?: string;
}

export interface HeightDefaults {
  scale: number;
  height_z_cm: string;
  font: string;
  show_usage: boolean;
}

// ============================================================================
// LIGHTING ANNOTATION
// ============================================================================

export interface LightingAnnotationArgs extends AnnotationArgs {
  circuit_text: string;
  circuit_scale?: number;
  circuit_height_cm?: number;
  circuit_font?: string;
  circuit_text_color?: string;
}

export interface LightingDefaults {
  circuit_text: string;
  circuit_scale: number;
  circuit_height_cm: number;
  circuit_font: string;
  circuit_text_color: string;
}

// ============================================================================
// SECTION ANNOTATION
// ============================================================================

export interface SectionAnnotationArgs extends AnnotationArgs {
  section_name: string;
  scale?: string;
}

// ============================================================================
// COMPONENT UPDATER
// ============================================================================

export interface ComponentUpdaterArgs {
  attribute_type: string;
  new_value: string;
  situation_type: string;
}

export interface ComponentUpdaterDefaults {
  last_attribute: string;
  last_value: string;
  last_situation_type: string;
}
