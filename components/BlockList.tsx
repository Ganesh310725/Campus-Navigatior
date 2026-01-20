
import React from 'react';
import { Building } from '../types';

interface BlockListProps {
  buildings: Building[];
  onSelect: (building: Building) => void;
  selectedId?: string;
}

const BlockList: React.FC<BlockListProps> = ({ buildings, onSelect, selectedId }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {buildings.map((building) => (
        <button
          key={building.id}
          onClick={() => onSelect(building)}
          className={`group relative flex flex-col overflow-hidden rounded-[2rem] border transition-all duration-300 text-left active:scale-[0.98] ${
            selectedId === building.id 
              ? 'ring-4 ring-blue-500/20 border-blue-500 bg-blue-50' 
              : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl'
          }`}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <img 
              src={building.image} 
              alt={building.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                {building.type}
              </span>
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
              {building.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold text-slate-500">Floor {building.floors}</span>
              {building.roomNumber && (
                <span className="text-xs font-bold text-blue-500">• Room {building.roomNumber}</span>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
              {building.description}
            </p>
            
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Tap for Details
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default BlockList;
