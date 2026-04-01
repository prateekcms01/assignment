import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProviderHandymen from './ProviderHandymen';
import ProviderAssignService from './ProviderAssignService';
import ProviderAssignZone from './ProviderAssignZone';

const ProviderProfile = ({ token, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/providers/data/getProviderProfile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Handling varied response structures (e.g., response.data.provider or response.data.data)
        const profileData = response.data.provider || response.data.data || response.data;
        if (profileData && response.data.success !== false) {
          setProfile(profileData);
        } else {
          setError('Failed to load profile data.');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to authenticate profile. Session may have expired.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-emerald-500 mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-emerald-400 font-medium animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="max-w-md w-full backdrop-blur-xl bg-slate-900/60 border border-red-500/30 p-8 rounded-3xl shadow-2xl text-center">
           <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           </div>
           <h2 className="text-xl font-bold text-white mb-2">Authentication Error</h2>
           <p className="text-red-400 text-sm mb-6">{error}</p>
           <button onClick={onLogout} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium text-sm">Return to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 flex justify-center selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="fixed top-[10%] right-[-5%] w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-4xl relative z-10 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center backdrop-blur-md bg-slate-900/40 border border-slate-700/50 p-4 md:px-8 md:py-4 rounded-2xl shadow-xl">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
               {profile?.name?.charAt(0) || 'P'}
             </div>
             <div>
               <h1 className="text-xl font-bold text-white tracking-tight">Provider Dashboard</h1>
               <p className="text-xs text-slate-400">View your operational data</p>
             </div>
           </div>
           <button 
             onClick={onLogout}
             className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700 hover:border-slate-600 text-sm font-medium"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
             Logout
           </button>
        </div>

        {/* Main Profile Info */}
        <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="h-40 bg-gradient-to-r from-slate-800 via-emerald-900/40 to-teal-900/40 border-b border-slate-700/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
              </div>

              <div className="px-8 pb-8">
                <div className="relative flex justify-between items-end -mt-16 mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-1.5 shadow-xl shadow-emerald-500/20">
                      <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                          <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                            {profile?.name?.charAt(0) || 'P'}
                          </span>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-800 rounded-full border-2 border-slate-900 flex items-center justify-center">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                      <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold uppercase tracking-wider">
                        {profile?.role || 'Provider'}
                      </span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{profile?.name || 'Provider User'}</h2>
                    <p className="text-slate-400 flex items-center gap-2 text-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      {profile?.email || 'provider@example.com'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-700/50 pt-8">
                      <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-emerald-500/10 rounded-lg">
                             <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                           </div>
                           <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Member Since</p>
                        </div>
                        <p className="text-slate-200 font-medium text-lg ml-11">
                          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>

                      <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-teal-500/10 rounded-lg">
                             <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                           </div>
                           <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Account Status</p>
                        </div>
                        <p className="text-slate-200 font-medium text-lg ml-11 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></span>
                          Active
                        </p>
                      </div>
                  </div>
                </div>
              </div>
        </div>

        {/* Action Components */}
        <ProviderHandymen token={token} />
        <ProviderAssignService token={token} />
        <ProviderAssignZone token={token} />

      </div>
    </div>
  );
};

export default ProviderProfile;
