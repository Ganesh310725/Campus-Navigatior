
export enum BuildingType {
  ACADEMIC = 'Academic',
  DINING = 'Dining',
  LIBRARY = 'Library',
  FACILITY = 'Facility',
  OFFICE = 'Office',
  OUTDOOR = 'Outdoor'
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Building {
  id: string;
  name: string;
  type: BuildingType;
  description: string;
  location: Coordinate;
  floors: number;
  amenities: string[];
  image: string;
  isActive?: boolean;
  roomNumber?: string;
}

export interface PathNode {
  id: string;
  location: Coordinate;
  isAccessible: boolean;
  isCovered: boolean;
  isScenic: boolean;
}

export interface Edge {
  from: string;
  to: string;
  distance: number;
  tags: ('accessible' | 'scenic' | 'covered')[];
}

export type RoutePreference = 'shortest' | 'accessible' | 'scenic' | 'covered';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface WebSearchResponse {
  text: string;
  sources: GroundingSource[];
}

export type AuthRole = 'none' | 'student' | 'admin';
