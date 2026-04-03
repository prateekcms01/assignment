import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../config";

const AdminServices = ({ token }) => {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  const [serviceData, setServiceData] = useState({ name: '', description: '' });
  const [savingService, setSavingService] = useState(false);
  const [serviceError, setServiceError] = useState('');
  const [serviceSuccess, setServiceSuccess] = useState('');

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/admins/data/getadminServices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data.services || response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchServices();
    }
  }, [token]);

  const handleOpenCreate = () => {
    setServiceData({ name: '', description: '' });
    setEditingServiceId(null);
    setIsEditing(false);
    setServiceError('');
    setServiceSuccess('');
    setShowServiceModal(true);
  };

  const handleOpenEdit = (service) => {
    setServiceData({ name: service.name, description: service.description });
    setEditingServiceId(service.id || service._id);
    setIsEditing(true);
    setServiceError('');
    setServiceSuccess('');
    setShowServiceModal(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setSavingService(true);
    setServiceError('');
    setServiceSuccess('');
    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/v1/admins/data/update-service/${editingServiceId}`, serviceData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setServiceSuccess('Service updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/v1/admins/data/create-service`, serviceData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setServiceSuccess('Service created successfully!');
      }
      
      fetchServices();
      setTimeout(() => {
        setServiceSuccess('');
        setShowServiceModal(false);
      }, 1500);
      
    } catch (err) {
      setServiceError(err.response?.data?.message || err.message || 'Failed to save service.');
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/admins/data/delete-service/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete service.');
      console.error(err);
    }
  };

  return (
    <>
      <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Service Categories
            </h2>
            <p className="text-sm text-slate-400 mt-1">Manage all available service models.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-cyan-500/25 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            New Service
          </button>
        </div>

        {loadingServices ? (
          <div className="py-12 flex justify-center text-cyan-500/50">
            <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : services.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-slate-800/30 border border-slate-700/50 border-dashed">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            </div>
            <p className="text-slate-400 text-sm">No services found.</p>
            <p className="text-slate-500 text-xs mt-1">Click "New Service" to add one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {services.map((service, idx) => {
              const svcId = service.id || service._id;
              return (
                <div key={svcId || idx} className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/30 p-5 rounded-2xl transition-all group flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-grow">
                      {service.description}
                    </p>
                    <div className="flex justify-between items-center text-xs border-t border-slate-700/50 pt-3">
                      <span className="flex items-center gap-1 text-slate-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {service.created_at ? new Date(service.created_at).toLocaleDateString() : 'Just now'}
                      </span>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleOpenEdit(service)} 
                          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >Edit</button>
                        <button
                          onClick={() => handleDeleteService(svcId)} 
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

      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowServiceModal(false)}></div>
          <div className="relative bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-white mb-2">
              {isEditing ? 'Edit Service' : 'Create New Service'}
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              {isEditing ? 'Update the details for this service category.' : 'Add a new category for contractors to register under.'}
            </p>
            
            {(serviceError || serviceSuccess) && (
              <div className={`p-3 rounded-xl mb-6 text-sm font-medium border ${serviceError ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'}`}>
                {serviceError || serviceSuccess}
              </div>
            )}

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={serviceData.name}
                  onChange={(e) => setServiceData({ ...serviceData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="e.g. Electrician"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={serviceData.description}
                  onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none"
                  placeholder="All electrician related services..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingService}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {savingService ? 'Saving...' : (isEditing ? 'Update Service' : 'Save Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminServices;
