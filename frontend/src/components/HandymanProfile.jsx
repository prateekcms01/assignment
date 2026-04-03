import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const HandymanProfile = ({ token, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState({ services: [], zones: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, assignmentsRes] = await Promise.all([
          axios.get(
            `${API_BASE_URL}/api/v1/handymen/data/getHandymanProfile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
          axios.get(
            `${API_BASE_URL}/api/v1/handymen/data/getHandymanassignedZoneandServices`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ]);

        const profileData =
          profileRes.data.handyman || profileRes.data.data || profileRes.data;
        if (profileData && profileRes.data.success !== false) {
          setProfile(profileData);
        } else {
          setError("Failed to load profile data.");
        }

        const assignsData = assignmentsRes.data;
        if (assignsData) {
          setAssignments({
            services: assignsData.services || [],
            zones: assignsData.zones || [],
          });
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to authenticate data. Session may have expired.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-amber-500 mb-4"
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
          <p className="text-amber-400 font-medium animate-pulse">
            Loading Workspace...
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

  const hasAssignments =
    assignments.services.length > 0 || assignments.zones.length > 0;

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 flex justify-center selection:bg-amber-500/30 relative overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="fixed top-[10%] right-[-5%] w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-4xl relative z-10 flex flex-col gap-6">
        <div className="flex justify-between items-center backdrop-blur-md bg-slate-900/40 border border-slate-700/50 p-4 md:px-8 md:py-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-amber-500/20">
              {profile?.name?.charAt(0) || "H"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Handyman Portal
              </h1>
              <p className="text-xs text-slate-400">
                View your operational data
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

        <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="h-40 bg-gradient-to-r from-slate-800 via-amber-900/40 to-orange-900/40 border-b border-slate-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
          </div>

          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-16 mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-1.5 shadow-xl shadow-amber-500/20">
                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                      {profile?.name?.charAt(0) || "H"}
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-800 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-semibold uppercase tracking-wider">
                  {profile?.role || "Handyman"}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profile?.name || "Handyman User"}
                </h2>
                <p className="text-slate-400 flex items-center gap-2 text-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  {profile?.email || "handyman@example.com"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-700/50 pt-8">
                <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg
                      className="w-16 h-16"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v5.41l4.7 4.7-1.41 1.42-5.3-5.3z"></path>
                    </svg>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <svg
                        className="w-5 h-5 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                      Onboarded Since
                    </p>
                  </div>
                  <p className="text-slate-200 font-medium text-lg ml-11">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : "N/A"}
                  </p>
                </div>

                <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg
                      className="w-16 h-16"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2z"></path>
                    </svg>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <svg
                        className="w-5 h-5 text-orange-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                      Assigned Provider
                    </p>
                  </div>
                  <div className="ml-11">
                    <p className="text-slate-200 font-bold text-lg">
                      {profile?.provider_name || "Unassigned"}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5 font-medium">
                      Ref ID #{profile?.provider_id || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            Assigned Tasks & Zones
          </h3>

          {!hasAssignments ? (
            <div className="py-12 text-center rounded-2xl bg-slate-800/30 border border-slate-700/50 border-dashed">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              </div>
              <p className="text-slate-400 text-sm">
                No tasks or zones assigned yet.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Waiting for your Provider to delegate responsibilities.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {assignments.services.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-slate-300 mb-4 border-b border-slate-700/50 pb-2">
                    Active Services
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {assignments.services.map((svc) => (
                      <div
                        key={svc.id || svc._id}
                        className="bg-slate-800/40 border border-amber-500/20 p-5 rounded-2xl flex items-start gap-4"
                      >
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-200">
                            {svc.name}
                          </h5>
                          <p className="text-sm text-slate-400 mt-1">
                            {svc.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Zones Grid */}
              {assignments.zones.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-slate-300 mb-4 border-b border-slate-700/50 pb-2">
                    Operational Zones
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {assignments.zones.map((zone) => (
                      <div
                        key={zone.id || zone._id}
                        className="bg-slate-800/40 border border-orange-500/20 p-5 rounded-2xl flex items-start gap-4"
                      >
                        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-200">
                            {zone.name}
                          </h5>
                          <p className="text-sm text-slate-400 mt-1">
                            {zone.city}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandymanProfile;
