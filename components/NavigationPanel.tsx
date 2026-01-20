
import React from 'react';
import { Building, PathNode, RoutePreference } from '../types';

interface NavigationPanelProps {
  route: PathNode[];
  destination: Building;
  preference: RoutePreference;
  onClose: () => void;
  advice: string;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ 
  destination, 
  onClose
}) => {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-white/95 backdrop-blur-xl shadow-[0_-12px_40px_rgba(0,0,0,0.15)] rounded-t-[2.5rem] p-8 transform transition-transform duration-500 z-[60] animate-slide-up border-t border-slate-100 max-h-[85vh] overflow-y-auto no-scrollbar">
      <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
      
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              Location Info
            </span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {destination.name}
          </h3>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-500 transition-all active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Building Details Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Floor</p>
            <p className="text-lg font-bold text-slate-900">{destination.floors || 'G'}</p>
          </div>
          {destination.roomNumber && (
            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room</p>
              <p className="text-lg font-bold text-blue-600">{destination.roomNumber}</p>
            </div>
          )}
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</p>
            <p className="text-lg font-bold text-slate-900">{destination.type}</p>
          </div>
        </div>

        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">About this location</p>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {destination.description}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-5 items-center p-4 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
          </div>
          <div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-0.5">Location ID</p>
            <p className="text-lg font-bold text-slate-900">{destination.name}</p>
          </div>
        </div>
      </div>

      <button onClick={onClose} className="w-full mt-8 py-5 bg-slate-900 hover:bg-black text-white font-black rounded-[1.5rem] shadow-2xl transition-all active:scale-[0.97] tracking-widest uppercase text-xs">
        Close Details
      </button>
    </div>
  );
};

export default NavigationPanel;
