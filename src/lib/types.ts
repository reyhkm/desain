export type Vector3 = [number, number, number];

export type SceneObject = Wall | Door | Window | Furniture;

export interface BaseObject {
  id: string;
  type: 'wall' | 'door' | 'window' | 'furniture';
}

export interface Wall extends BaseObject {
  type: 'wall';
  start: [number, number]; // 2D coordinates [x, z]
  end: [number, number]; // 2D coordinates [x, z]
  height: number;
  thickness: number;
}

export interface Door extends BaseObject {
  type: 'door';
  position: Vector3;
  width: number;
  height: number;
  wallId: string | null; // ID of the wall it's on
  positionOnWall: number; // Normalized position on the wall (0 to 1)
}

export interface Window extends BaseObject {
  type: 'window';
  position: Vector3;
  width: number;
  height: number;
  elevation: number; // height from the floor
  wallId: string | null;
  positionOnWall: number;
}

export interface Furniture extends BaseObject {
  type: 'furniture';
  position: Vector3;
  model: string; // Identifier for the GLB model
  rotation: Vector3;
  scale: Vector3;
}

export type EditorMode = '2D' | '3D';

export type ActiveTool = 'select' | 'wall' | 'door' | 'window' | 'furniture';
