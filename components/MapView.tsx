
import React, { useMemo } from 'react';
import { Building, PathNode, Coordinate } from '../types';

interface MapViewProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  onSelectBuilding: (building: Building) => void;
  currentRoute: PathNode[];
  userLocation: Coordinate;
}

const MapView: React.FC<MapViewProps> = ({ 
  buildings,
  selectedBuilding, 
  onSelectBuilding, 
  currentRoute
}) => {
  const viewBox = "0 0 1000 1000";

  const routePathD = useMemo(() => {
    if (currentRoute.length < 2) return "";
    return currentRoute.reduce((acc, node, idx) => {
      return acc + (idx === 0 ? `M ${node.location.x} ${node.location.y}` : ` L ${node.location.x} ${node.location.y}`);
    }, "");
  }, [currentRoute]);

  return (
    <div className="relative w-full h-full bg-slate-200 overflow-hidden cursor-grab active:cursor-grabbing">
      <svg 
        viewBox={viewBox} 
        className="w-full h-full transition-transform duration-500 ease-out"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e2e8f0" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="1000" height="1000" fill="url(#grid)" />

        {routePathD && (
          <path 
            d={routePathD} 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="12" 
            strokeLinejoin="round" 
            strokeLinecap="round"
            strokeDasharray="20 10"
            className="animate-pulse"
          >
            <animate attributeName="stroke-dashoffset" from="300" to="0" dur="10s" repeatCount="indefinite" />
          </path>
        )}

        {buildings.map(building => {
          const isSelected = selectedBuilding?.id === building.id;
          return (
            <g 
              key={building.id} 
              className="cursor-pointer group"
              onClick={() => onSelectBuilding(building)}
            >
              <rect 
                x={building.location.x - 40} y={building.location.y - 40} 
                width="80" height="80" rx="16"
                className={`transition-all duration-300 ${
                  isSelected ? 'fill-blue-600 shadow-2xl' : 'fill-white hover:fill-slate-50 shadow-md'
                } ${building.isActive === false ? 'opacity-50 grayscale' : ''}`}
                stroke={isSelected ? '#2563eb' : '#f1f5f9'}
                strokeWidth={isSelected ? '4' : '2'}
              />
              <text 
                x={building.location.x} y={building.location.y + 65} 
                textAnchor="middle" 
                className={`text-[14px] font-black select-none tracking-tight ${
                  isSelected ? 'fill-blue-700' : 'fill-slate-700'
                }`}
              >
                {building.name}
              </text>
              <circle cx={building.location.x} cy={building.location.y} r="12" fill={isSelected ? '#fff' : '#f1f5f9'} opacity="0.9" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MapView;
