import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminServices from "./AdminServices";
import AdminZone from "./AdminZone";
import AdminProviders from "./AdminProviders";

import { API_BASE_URL } from "../config";

const AdminProfile = ({ token, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/admins/data/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success && response.data.admin) {
        setProfile(response.data.admin);
      } else {
        setError("Failed to load profile data.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to authenticate profile. Session may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-cyan-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-cyan-400 font-medium animate-pulse">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="max-w-md w-full backdrop-blur-xl bg-slate-900/60 border border-red-500/30 p-8 rounded-3xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Authentication Error
          </h2>
          <p className="text-red-400 text-sm mb-6">{error}</p>
          <button
            onClick={onLogout}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium text-sm"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 flex justify-center selection:bg-cyan-500/30 relative overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="fixed top-[10%] right-[-5%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-5xl relative z-10 flex flex-col gap-6">
        <div className="flex justify-between items-center backdrop-blur-md bg-slate-900/40 border border-slate-700/50 p-4 md:px-8 md:py-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
              {profile?.name?.charAt(0) || "A"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-xs text-slate-400">
                Manage your system & services
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700 hover:border-slate-600 text-sm font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative h-full">
              <div className="h-24 bg-gradient-to-r from-slate-800 via-indigo-900/40 to-cyan-900/40 border-b border-slate-700/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
              </div>

              <div className="px-6 pb-6">
                <div className="relative flex justify-center -mt-12 mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 p-1 shadow-xl shadow-cyan-500/20">
                      <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                          {profile?.name?.charAt(0) || "A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {profile?.name || "Admin User"}
                  </h2>
                  <p className="text-slate-400 text-sm">{profile?.email}</p>
                  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                    {profile?.role || "Admin"}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-700/50">
                  <div className="flex justify-between items-center bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
                    <span className="text-xs text-slate-500 uppercase font-medium">
                      Joined
                    </span>
                    <span className="text-sm text-slate-200 font-medium">
                      {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <AdminServices token={token} />
            <AdminZone token={token} />
            <AdminProviders token={token} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
