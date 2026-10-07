export type FloorId = "roof" | "f3" | "f2" | "f1" | "campus";

export type RoomCategory =
  | "classroom"
  | "club"
  | "facility"
  | "admin"
  | "utility"
  | "common"
  | "outdoor"
  | "access";

export type LabelOrientation = "horizontal" | "vertical";

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Room {
  id: string;
  name: string;
  shortLabel?: string;
  category: RoomCategory;
  floorId: FloorId;
  rect: Rect;
  polygon?: Point[];
  labelOrientation: LabelOrientation;
  description?: string;
  ekskulId?: string;
  relatedEkskulIds?: string[];
}

export interface DecorativeElement {
  id: string;
  type: "path" | "circle" | "polygon" | "rect";
  points?: Point[];
  pathData?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  r?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface Floor {
  id: FloorId;
  label: string;
  level: number; // 3D height index: f1=1, f2=2, f3=3, roof=4, campus=0
  viewBox: string;
  outline: Point[];
  courtyard?: Point[];
  rooms: Room[];
  decorativeElements?: DecorativeElement[];
}

export type MapMode = "2d" | "3d";
