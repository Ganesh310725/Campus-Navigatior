
import React, { useState, useCallback, useMemo } from 'react';
import { Building, Coordinate, PathNode, RoutePreference, AuthRole, WebSearchResponse } from './types';
import { NODES, BUILDINGS } from './constants';
import NavigationPanel from './components/NavigationPanel';
import AdminDashboard from './components/AdminDashboard';
import BlockList from './components/BlockList';
import { calculateRoute } from './services/navigationService';

const App: React.FC = () => {
  const [role, setRole] = useState<AuthRole>('none');
  const [isAdminLoginForm, setIsAdminLoginForm] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Initialize with predefined buildings
  const [campusBuildings, setCampusBuildings] = useState<Building[]>(BUILDINGS);
  const [userLocation] = useState<Coordinate>({ x: 500, y: 950 });
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<PathNode[]>([]);
  const [routePreference, setRoutePreference] = useState<RoutePreference>('shortest');

  const activeBuildings = useMemo(() => {
    return campusBuildings.filter(b => b.isActive !== false);
  }, [campusBuildings]);

  const filteredBuildings = useMemo(() => {
    return activeBuildings.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeBuildings, searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSelectedBuilding(null);

    const match = activeBuildings.find(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (match) {
      setSelectedBuilding(match);
      setSearchQuery(match.name);
    }
    setShowSearchDropdown(false);
  };

  const selectBuildingFromList = (b: Building) => {
    setSelectedBuilding(b);
    setSearchQuery(b.name);
    setShowSearchDropdown(false);
    handleStartNavigation(b);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'Cambridgeadmin' && adminPassword === 'whoareyou') {
      setRole('admin');
      setAdminError('');
      setIsAdminLoginForm(false);
    } else {
      setAdminError('Invalid credentials. Access Denied.');
    }
  };

  const handleStartNavigation = useCallback((building: Building) => {
    const startNode = NODES[0]; // fallback start
    const endNode = NODES.find(n => n.id.includes(building.id)) || NODES[1];

    const route = calculateRoute(startNode.id, endNode.id, routePreference);
    setCurrentRoute(route);
  }, [routePreference]);

  const toggleBuildingStatus = (id: string) => {
    setCampusBuildings(prev => prev.map(b => b.id === id ? { ...b, isActive: b.isActive === false } : b));
  };

  const handleAddBuilding = (building: Building) => {
    setCampusBuildings(prev => [...prev, building]);
  };

  const handleRemoveBuilding = (id: string) => {
    setCampusBuildings(prev => prev.filter(b => b.id !== id));
    if (selectedBuilding?.id === id) setSelectedBuilding(null);
  };

  if (role === 'none') {
    return (
      <div className="h-screen w-full relative flex items-center justify-center p-6 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] ease-in-out scale-110"
          style={{ 
            backgroundImage: `url('https://res.cloudinary.com/dmvgh7mbu/image/upload/v1714138138/CIT_North_Campus_Main_vwyh0m.jpg')`,
            animation: 'slow-pan 30s infinite alternate'
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/20" />
        <div className="absolute inset-0 z-10 backdrop-blur-[1px]" />

        <div className="relative z-20 w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/20">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">CIT Navigator</h1>
            <p className="mt-3 text-slate-200 font-bold text-lg tracking-widest uppercase drop-shadow-md">North Campus Bangalore</p>
          </div>

          {!isAdminLoginForm ? (
            <div className="grid grid-cols-1 gap-4 mt-8">
              <button onClick={() => setRole('student')} className="group p-6 bg-white/10 backdrop-blur-3xl rounded-[2rem] border border-white/20 hover:bg-white/20 hover:border-white/40 shadow-2xl transition-all text-left flex items-center gap-6 active:scale-[0.98]">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">Student Portal</p>
                  <p className="text-sm text-slate-300">Campus Directory & Info</p>
                </div>
              </button>
              <button onClick={() => setIsAdminLoginForm(true)} className="group p-6 bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/10 hover:bg-slate-900/60 shadow-2xl transition-all text-left flex items-center gap-6 active:scale-[0.98]">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white shadow-sm group-hover:bg-blue-600 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">Admin Console</p>
                  <p className="text-sm text-slate-400">Campus Block Management</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20 animate-slide-up mt-8">
              <form onSubmit={handleAdminLogin} className="space-y-6 text-left">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Username</label>
                  <input type="text" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} className="w-full p-4 bg-slate-100 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900" placeholder="Admin username" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
                  <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full p-4 bg-slate-100 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900" placeholder="••••••••" required />
                </div>
                {adminError && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl">{adminError}</div>}
                <div className="flex flex-col gap-3 pt-2">
                  <button type="submit" className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all">Authorize Access</button>
                  <button type="button" onClick={() => setIsAdminLoginForm(false)} className="w-full py-2 text-slate-500 text-sm font-bold hover:text-slate-800 transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>

        <style>{`
          @keyframes slow-pan {
            from { transform: scale(1.15) translateX(-30px); }
            to { transform: scale(1.15) translateX(30px); }
          }
          @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        `}</style>
      </div>
    );
  }

  if (role === 'admin') {
    return <AdminDashboard buildings={campusBuildings} onToggleStatus={toggleBuildingStatus} onAddBuilding={handleAddBuilding} onRemoveBuilding={handleRemoveBuilding} onLogout={() => setRole('none')} />;
  }

  return (
    <div className="relative h-screen w-full bg-slate-50 flex flex-col overflow-hidden">
      <header className="p-4 z-40 bg-white border-b border-slate-100">
        <div className="max-w-md mx-auto relative">
          <div className="relative flex items-center">
            <div className="absolute left-4 z-10 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search campus blocks..."
              className="w-full h-14 pl-14 pr-12 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
          </div>

          {showSearchDropdown && (
            <div className="absolute top-14 left-0 right-0 bg-white shadow-2xl rounded-b-2xl border-t border-slate-50 max-h-[60vh] overflow-y-auto no-scrollbar z-50">
              {filteredBuildings.length > 0 ? (
                <div className="p-2 space-y-1">
                  <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campus Landmarks</p>
                  {filteredBuildings.map(b => (
                    <button key={b.id} onClick={() => selectBuildingFromList(b)} className="w-full text-left p-4 hover:bg-slate-50 rounded-xl flex items-center gap-4 transition-colors">
                      <img src={b.image} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{b.name}</p>
                        <p className="text-xs text-slate-500">{b.type} • Floor {b.floors}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                   <p className="text-slate-400 font-medium">No results found in directory.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CIT North Campus Portal</span>
            </div>
            <button onClick={() => setRole('none')} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest">Logout</button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-y-auto no-scrollbar p-4 bg-slate-50 pb-24" onClick={() => setShowSearchDropdown(false)}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Campus Blocks</h2>
          <BlockList 
            buildings={filteredBuildings} 
            selectedId={selectedBuilding?.id}
            onSelect={(b) => {
              setSelectedBuilding(b);
              handleStartNavigation(b);
            }} 
          />
        </div>

        {selectedBuilding && (
          <NavigationPanel 
            route={currentRoute} 
            destination={selectedBuilding} 
            preference={routePreference} 
            advice="" 
            onClose={() => {
              setSelectedBuilding(null);
              setCurrentRoute([]);
            }} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
