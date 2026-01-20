
import React, { useState } from 'react';
import { Building, BuildingType } from '../types';

interface AdminDashboardProps {
  buildings: Building[];
  onToggleStatus: (id: string) => void;
  onAddBuilding: (building: Building) => void;
  onRemoveBuilding: (id: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ buildings, onToggleStatus, onAddBuilding, onRemoveBuilding, onLogout }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBuilding, setNewBuilding] = useState<Partial<Building>>({
    name: '',
    type: BuildingType.ACADEMIC,
    description: '',
    roomNumber: '',
    amenities: [],
    image: '',
    location: { x: 500, y: 500 }, // Default center
    floors: 0
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBuilding({ ...newBuilding, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBuilding.name && newBuilding.image) {
      onAddBuilding({
        ...newBuilding as Building,
        id: `custom_${Date.now()}`,
        isActive: true,
        amenities: newBuilding.amenities || []
      });
      setShowAddModal(false);
      setNewBuilding({
        name: '',
        type: BuildingType.ACADEMIC,
        description: '',
        roomNumber: '',
        amenities: [],
        image: '',
        location: { x: 500, y: 500 },
        floors: 0
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      <header className="p-6 bg-white border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Command Center</h1>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">CIT Bangalore Management</p>
        </div>
        <button 
          onClick={onLogout}
          className="px-4 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold rounded-xl transition-all"
        >
          Logout
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Facilities</p>
            <p className="text-2xl font-black text-slate-900">{buildings.length}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Operational</p>
            <p className="text-2xl font-black text-emerald-600">{buildings.filter(b => b.isActive !== false).length}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Alerts</p>
            <p className="text-2xl font-black text-amber-600">0</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Updates</p>
            <p className="text-2xl font-black text-blue-600">Just Now</p>
          </div>
        </div>

        {/* Building List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-20">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Landmark Management</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              Add New Landmark
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {buildings.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={b.image} className="w-12 h-12 rounded-xl object-cover" alt={b.name} />
                  <div>
                    <h3 className="font-bold text-slate-800">{b.name}</h3>
                    <div className="flex gap-2">
                      <p className="text-[10px] text-slate-400 uppercase font-black">{b.type}</p>
                      {b.roomNumber && <p className="text-[10px] text-blue-500 uppercase font-black">• Room {b.roomNumber}</p>}
                      <p className="text-[10px] text-slate-400 uppercase font-black">• Floor {b.floors}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${b.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {b.isActive !== false ? 'Active' : 'Maintenance'}
                  </div>
                  <button 
                    onClick={() => onToggleStatus(b.id)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-all text-xs font-bold"
                  >
                    Status
                  </button>
                  <button 
                    onClick={() => onRemoveBuilding(b.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-all text-xs font-bold"
                    title="Remove Landmark"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900">Add New Landmark</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Landmark Name</label>
                <input 
                  type="text" 
                  value={newBuilding.name}
                  onChange={e => setNewBuilding({...newBuilding, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                  placeholder="e.g. Physics Lab 301"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Type</label>
                  <select 
                    value={newBuilding.type}
                    onChange={e => setNewBuilding({...newBuilding, type: e.target.value as BuildingType})}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 appearance-none"
                  >
                    {Object.values(BuildingType).map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Floor Number</label>
                  <input 
                    type="number" 
                    value={newBuilding.floors === 0 ? '' : newBuilding.floors}
                    onChange={e => setNewBuilding({...newBuilding, floors: parseInt(e.target.value) || 0})}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                    placeholder="e.g. 1"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Room Number (Optional)</label>
                <input 
                  type="text" 
                  value={newBuilding.roomNumber}
                  onChange={e => setNewBuilding({...newBuilding, roomNumber: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
                  placeholder="e.g. RM-402"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Description</label>
                <textarea 
                  value={newBuilding.description}
                  onChange={e => setNewBuilding({...newBuilding, description: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 h-24"
                  placeholder="Briefly describe this location..."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Photo Upload</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="admin-photo-upload"
                  />
                  <label 
                    htmlFor="admin-photo-upload"
                    className="w-full p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all"
                  >
                    {newBuilding.image ? (
                      <div className="relative w-full h-40">
                        <img src={newBuilding.image} className="w-full h-full object-cover rounded-xl shadow-md" />
                        <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white text-xs font-bold">Change Photo</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Select Building Image</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]">
                  Publish Landmark
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
