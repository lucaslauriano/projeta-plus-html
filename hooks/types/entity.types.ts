/**
 * Entity-specific types for CRUD operations
 */

export interface BaseEntity {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface EntityData<T extends BaseEntity = BaseEntity> {
  [key: string]: T[] | unknown;
}

export interface EntityGroup<T extends BaseEntity = BaseEntity> {
  id: string;
  name: string;
  items: T[];
  [key: string]: unknown;
}

export interface EntityWithGroups<T extends BaseEntity = BaseEntity> {
  groups: EntityGroup<T>[];
  items?: T[];
  [key: string]: unknown;
}

// View Config specific types
export interface ViewConfig extends BaseEntity {
  style: string;
  cameraType: string;
  activeLayers: string[];
}

export interface ViewConfigData {
  groups: EntityGroup<ViewConfig>[];
  [key: string]: ViewConfig[] | unknown;
}

export interface CurrentState {
  style: string;
  cameraType: string;
  activeLayers: string[];
}

// Section specific types
export interface Section extends BaseEntity {
  position: [number, number, number];
  direction: [number, number, number];
  active: boolean;
}

export interface SectionsData {
  sections: Section[];
}

// Layer specific types
export interface SketchUpTag {
  name: string;
  visible: boolean;
  color: [number, number, number];
}

export interface SketchUpFolder {
  name: string;
  tags: SketchUpTag[];
}

export interface LayersData {
  folders: SketchUpFolder[];
  tags: SketchUpTag[];
}
