/**
 * Component library types
 */

export interface LibraryItem {
  id: string;
  name: string;
  path: string;
  source?: string;
  [key: string]: unknown;
}

export interface LibraryGroup {
  id: string;
  title: string;
  items: LibraryItem[];
  source?: string;
  [key: string]: unknown;
}

export interface LibraryData {
  groups: LibraryGroup[];
  components_path?: string;
  [key: string]: unknown;
}

export interface LibraryResult {
  success: boolean;
  message?: string;
  groups?: LibraryGroup[];
  components_path?: string;
  filename?: string;
  block_name?: string;
  category?: string;
  count?: number;
}

// Furniture specific types
export interface FurnitureFormPayload {
  entity_id?: number;
  name: string;
  color: string;
  brand: string;
  type: string;
  dimension_format: string;
  dimension: string;
  environment: string;
  value: string;
  link: string;
  observations: string;
  width: string;
  depth: string;
  height: string;
}

export interface FurnitureDimensions {
  width: string;
  depth: string;
  height: string;
}

export interface FurnitureData
  extends FurnitureFormPayload,
    FurnitureDimensions {
  selected: boolean;
}

export interface FurnitureAttributesResponse {
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
