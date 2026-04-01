import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminZone = ({ token }) => {
  const [zones, setZones] = useState([]);
  const [loadingZones, setLoadingZones] = useState(false);
  
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState(null);

  const [zoneData, setZoneData] = useState({ name: '', city: '' });
  const [savingZone, setSavingZone] = useState(false);
  const [zoneError, setZoneError] = useState('');
  const [zoneSuccess, setZoneSuccess] = useState('');

  const fetchZones = async () => {
    setLoadingZones(true);
    try {
      const response = await axios.get('http://localhost:3000/api/v1/admins/data/getadminZones', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setZones(response.data.zones || response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch zones', err);
    } finally {
      setLoadingZones(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchZones();
    }
  }, [token]);

  const handleOpenCreate = () => {
    setZoneData({ name: '', city: '' });
    setEditingZoneId(null);
    setIsEditing(false);
    setZoneError('');
    setZoneSuccess('');
    setShowZoneModal(true);
  };

  const handleOpenEdit = (zone) => {
    setZoneData({ name: zone.name, city: zone.city });
    setEditingZoneId(zone.id || zone._id);
    setIsEditing(true);
    setZoneError('');
    setZoneSuccess('');
    setShowZoneModal(true);
  };

  const handleSaveZone = async (e) => {
    e.preventDefault();
    setSavingZone(true);
    setZoneError('');
    setZoneSuccess('');
    try {
      if (isEditing) {
        await axios.put(`http://localhost:3000/api/v1/admins/data/updateadminZone/${editingZoneId}`, zoneData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setZoneSuccess('Zone updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/v1/admins/data/createZone', zoneData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setZoneSuccess('Zone created successfully!');
      }
      
      fetchZones();
      setTimeout(() => {
        setZoneSuccess('');
        setShowZoneModal(false);
      }, 1500);
      
    } catch (err) {
      setZoneError(err.response?.data?.message || err.message || 'Failed to save zone.');
    } finally {
      setSavingZone(false);
    }
  };

  const handleDeleteZone = async (id) => {
    if (!window.confirm('Are you sure you want to delete this zone? This action cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/admins/data/deleteadminZone/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchZones();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete zone.');
      console.error(err);
    }
  };

  return (
    <>
      <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Operating Zones
            </h2>
            <p className="text-sm text-slate-400 mt-1">Manage operational cities and zones.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-500/25 flex items-center gap-2 border border-transparent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            New Zone
          </button>
        </div>

        {loadingZones ? (
          <div className="py-12 flex justify-center text-indigo-500/50">
            <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : zones.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-slate-800/30 border border-slate-700/50 border-dashed">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p className="text-slate-400 text-sm">No zones found.</p>
            <p className="text-slate-500 text-xs mt-1">Click "New Zone" to add a location.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {zones.map((zone, idx) => {
              const zoneId = zone.id || zone._id;
              return (
                <div key={zoneId || idx} className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 p-5 rounded-2xl transition-all group flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors mb-2">
                      {zone.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 flex-grow flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                      {zone.city}
                    </p>
                    <div className="flex justify-between items-center text-xs border-t border-slate-700/50 pt-3">
                      <span className="flex items-center gap-1 text-slate-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {zone.created_at ? new Date(zone.created_at).toLocaleDateString() : 'Just now'}
                      </span>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleOpenEdit(zone)} 
                          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                        >Edit</button>
                        <button
                          onClick={() => handleDeleteZone(zoneId)} 
                          className="text-red-400 hover:text-red-300 font-medium transition-colors"
                        >Delete</button>
                      </div>
                    </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showZoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowZoneModal(false)}></div>
          <div className="relative bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-white mb-2">
              {isEditing ? 'Edit Zone' : 'Create New Zone'}
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              {isEditing ? 'Update the details for this zone.' : 'Add a new operational city and zone.'}
            </p>
            
            {(zoneError || zoneSuccess) && (
              <div className={`p-3 rounded-xl mb-6 text-sm font-medium border ${zoneError ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'}`}>
                {zoneError || zoneSuccess}
              </div>
            )}

            <form onSubmit={handleSaveZone} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Zone Name</label>
                <input
                  type="text"
                  required
                  value={zoneData.name}
                  onChange={(e) => setZoneData({ ...zoneData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  placeholder="e.g. Zone A"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">City</label>
                <input
                  type="text"
                  required
                  value={zoneData.city}
                  onChange={(e) => setZoneData({ ...zoneData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  placeholder="e.g. Bangalore"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowZoneModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingZone}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                >
                  {savingZone ? 'Saving...' : (isEditing ? 'Update Zone' : 'Save Zone')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminZone;
