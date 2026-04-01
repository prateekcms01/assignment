import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProviders = ({ token }) => {
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [providerData, setProviderData] = useState({ name: '', email: '', password: '', role: 'provider' });
  const [creatingProvider, setCreatingProvider] = useState(false);
  const [providerError, setProviderError] = useState('');
  const [providerSuccess, setProviderSuccess] = useState('');

  const fetchProviders = async () => {
    setLoadingProviders(true);
    try {
      const response = await axios.get('http://localhost:3000/api/v1/admins/data/getProviders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProviders(response.data.providers || response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch providers', err);
    } finally {
      setLoadingProviders(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProviders();
    }
  }, [token]);

  const handleOpenCreate = () => {
    setProviderData({ name: '', email: '', password: '', role: 'provider' });
    setProviderError('');
    setProviderSuccess('');
    setShowProviderModal(true);
  };

  const handleCreateProvider = async (e) => {
    e.preventDefault();
    setCreatingProvider(true);
    setProviderError('');
    setProviderSuccess('');
    
    try {
      await axios.post('http://localhost:3000/api/v1/admins/data/createProvider', providerData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProviderSuccess('Provider created successfully!');
      fetchProviders();
      
      setTimeout(() => {
        setProviderSuccess('');
        setShowProviderModal(false);
      }, 1500);
      
    } catch (err) {
      setProviderError(err.response?.data?.message || err.message || 'Failed to create provider.');
    } finally {
      setCreatingProvider(false);
    }
  };

  return (
    <>
      <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Provider Management
            </h2>
            <p className="text-sm text-slate-400 mt-1">Onboard and view all service providers.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/25 flex items-center gap-2 border border-transparent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            Add Provider
          </button>
        </div>

        {loadingProviders ? (
          <div className="py-12 flex justify-center text-emerald-500/50">
            <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : providers.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-slate-800/30 border border-slate-700/50 border-dashed">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <p className="text-slate-400 text-sm">No providers found.</p>
            <p className="text-slate-500 text-xs mt-1">Click "Add Provider" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <div key={provider.id || provider._id} className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/30 p-5 rounded-2xl transition-all group flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
                      {provider.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {provider.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate w-32 md:w-40" title={provider.email}>
                        {provider.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                      {provider.role || 'Provider'}
                    </span>
                    
                    <div className="flex justify-between items-center text-[11px] border-t border-slate-700/50 pt-3">
                      <span className="flex items-center gap-1 text-slate-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Joined {provider.created_at ? new Date(provider.created_at).toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showProviderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowProviderModal(false)}></div>
          <div className="relative bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-white mb-2">Create New Provider</h3>
            <p className="text-sm text-slate-400 mb-6">Register a new service provider account.</p>
            
            {(providerError || providerSuccess) && (
              <div className={`p-3 rounded-xl mb-6 text-sm font-medium border ${providerError ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'}`}>
                {providerError || providerSuccess}
              </div>
            )}

            <form onSubmit={handleCreateProvider} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={providerData.name}
                  onChange={(e) => setProviderData({ ...providerData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  placeholder="e.g. Provider User"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={providerData.email}
                  onChange={(e) => setProviderData({ ...providerData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  placeholder="provider@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <input
                  type="password"
                  required
                  value={providerData.password}
                  onChange={(e) => setProviderData({ ...providerData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  placeholder="••••••"
                />
              </div>

              <div className="space-y-1.5 opacity-70">
                <label className="text-sm font-medium text-slate-300 ml-1">Role</label>
                <div className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 flex items-center cursor-not-allowed">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  Provider (Locked)
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProviderModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProvider}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                >
                  {creatingProvider ? 'Creating...' : 'Create Provider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProviders;
