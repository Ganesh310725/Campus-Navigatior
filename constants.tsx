
import { Building, BuildingType, PathNode, Edge } from './types';

// Precise geographic boundaries for Cambridge Institute of Technology, KR Puram, Bangalore
export const CAMPUS_BOUNDS = {
  north: 13.0125, 
  south: 13.0085, 
  west: 77.7030, 
  east: 77.7075  
};

export const BUILDINGS: Building[] = [
  {
    id: 'cit_admin',
    name: 'Sir M.V. Block',
    type: BuildingType.ACADEMIC,
    description: 'The administrative headquarters and home to CS, IS, and Electronics departments. Features modern smart classrooms.',
    location: { x: 500, y: 300 },
    floors: 5,
    amenities: ['Admin Office', 'Computer Labs', 'Dean Office', 'Placement Cell'],
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cit_mech',
    name: 'Vikram Sarabhai Block',
    type: BuildingType.ACADEMIC,
    description: 'Dedicated to Mechanical and Civil Engineering. Houses heavy machinery labs and workshop facilities.',
    location: { x: 300, y: 550 },
    floors: 4,
    amenities: ['Workshops', 'Drawing Halls', 'Civil Labs'],
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cit_library',
    name: 'Central Library',
    type: BuildingType.LIBRARY,
    description: 'A vast repository of technical journals and academic books. Includes a digital library section.',
    location: { x: 700, y: 450 },
    floors: 3,
    amenities: ['Digital Access', 'Reference Section', 'Quiet Zones'],
    image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cit_canteen',
    name: 'Campus Canteen',
    type: BuildingType.DINING,
    description: 'The social heart of the campus. Famous for its South Indian breakfast and quick snacks.',
    location: { x: 500, y: 700 },
    floors: 1,
    amenities: ['Vegetarian', 'Juice Bar', 'Outdoor Seating'],
    image: 'https://images.unsplash.com/photo-1567529854338-fc097b962123?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cit_sports',
    name: 'Sports Complex',
    type: BuildingType.FACILITY,
    description: 'Grounds for Cricket, Football, and Basketball. Often hosts the annual "CHIGURU" fest events.',
    location: { x: 200, y: 200 },
    floors: 1,
    amenities: ['Cricket Pitch', 'Gym', 'Badminton Court'],
    image: 'https://images.unsplash.com/photo-1541252260730-0412e3e2108e?auto=format&fit=crop&w=400&q=80'
  }
];

export const NODES: PathNode[] = [
  { id: 'n_entrance', location: { x: 500, y: 950 }, isAccessible: true, isCovered: false, isScenic: true },
  { id: 'n_canteen', location: { x: 500, y: 700 }, isAccessible: true, isCovered: true, isScenic: false },
  { id: 'n_library', location: { x: 700, y: 450 }, isAccessible: true, isCovered: false, isScenic: true },
  { id: 'n_admin', location: { x: 500, y: 300 }, isAccessible: true, isCovered: true, isScenic: false },
  { id: 'n_mech', location: { x: 300, y: 550 }, isAccessible: true, isCovered: false, isScenic: false },
  { id: 'n_sports', location: { x: 200, y: 200 }, isAccessible: true, isCovered: false, isScenic: true },
  { id: 'n_quadrangle', location: { x: 500, y: 500 }, isAccessible: true, isCovered: false, isScenic: true }
];

export const EDGES: Edge[] = [
  { from: 'n_entrance', to: 'n_canteen', distance: 250, tags: ['accessible'] },
  { from: 'n_canteen', to: 'n_quadrangle', distance: 200, tags: ['scenic'] },
  { from: 'n_quadrangle', to: 'n_admin', distance: 200, tags: ['accessible', 'covered'] },
  { from: 'n_quadrangle', to: 'n_library', distance: 200, tags: ['scenic'] },
  { from: 'n_quadrangle', to: 'n_mech', distance: 200, tags: ['accessible'] },
  { from: 'n_mech', to: 'n_sports', distance: 350, tags: ['scenic'] },
  { from: 'n_admin', to: 'n_sports', distance: 300, tags: ['accessible'] }
];
