import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const ProviderHandymen = ({ token }) => {
  const [handymen, setHandymen] = useState([]);
  const [loadingHandymen, setLoadingHandymen] = useState(false);

  const [showHandymanModal, setShowHandymanModal] = useState(false);
  const [handymanData, setHandymanData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [creatingHandyman, setCreatingHandyman] = useState(false);
  const [handymanError, setHandymanError] = useState("");
  const [handymanSuccess, setHandymanSuccess] = useState("");

  const fetchHandymen = async () => {
    setLoadingHandymen(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/providers/data/getProviderHandymen`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setHandymen(
        response.data.handymen || response.data.data || response.data || [],
      );
    } catch (err) {
      console.error("Failed to fetch handymen", err);
    } finally {
      setLoadingHandymen(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHandymen();
    }
  }, [token]);

  const handleOpenCreate = () => {
    setHandymanData({ name: "", email: "", password: "" });
    setHandymanError("");
    setHandymanSuccess("");
    setShowHandymanModal(true);
  };

  const handleCreateHandyman = async (e) => {
    e.preventDefault();
    setCreatingHandyman(true);
    setHandymanError("");
    setHandymanSuccess("");

    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/providers/data/createHandyman`,
        handymanData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setHandymanSuccess("Handyman registered successfully!");
      fetchHandymen(); // Refresh the list

      setTimeout(() => {
        setHandymanSuccess("");
        setShowHandymanModal(false);
      }, 1500);
    } catch (err) {
      setHandymanError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create handyman.",
      );
    } finally {
      setCreatingHandyman(false);
    }
  };

  return (
    <>
      <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              Handyman Team
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Manage all handymen registered under your account.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-teal-500/25 flex items-center gap-2 border border-transparent"
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
            Add Handyman
          </button>
        </div>

        {loadingHandymen ? (
          <div className="py-12 flex justify-center text-teal-500/50">
            <svg
              className="animate-spin h-8 w-8"
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
          </div>
        ) : handymen.length === 0 ? (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <p className="text-slate-400 text-sm">No handymen staff found.</p>
            <p className="text-slate-500 text-xs mt-1">
              Click "Add Handyman" to register a team member.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {handymen.map((handyman) => (
              <div
                key={handyman.id || handyman._id}
                className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-teal-500/30 p-5 rounded-2xl transition-all group flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-teal-500/20">
                    {handyman.name?.charAt(0) || "H"}
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-slate-200 group-hover:text-teal-400 transition-colors">
                      {handyman.name}
                    </h3>
                    <p
                      className="text-xs text-slate-400 truncate w-32 md:w-40"
                      title={handyman.email}
                    >
                      {handyman.email}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-3">
                    Staff / Handyman
                  </span>

                  <div className="flex justify-between items-center text-[11px] border-t border-slate-700/50 pt-3">
                    <span className="flex items-center gap-1 text-slate-500">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        ></path>
                      </svg>
                      ID: {handyman.id || handyman._id || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showHandymanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setShowHandymanModal(false)}
          ></div>
          <div className="relative bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-white mb-2">
              Register Handyman
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Create a sub-account for your handyman staff.
            </p>

            {(handymanError || handymanSuccess) && (
              <div
                className={`p-3 rounded-xl mb-6 text-sm font-medium border ${handymanError ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-teal-500/50 bg-teal-500/10 text-teal-400"}`}
              >
                {handymanError || handymanSuccess}
              </div>
            )}

            <form onSubmit={handleCreateHandyman} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={handymanData.name}
                  onChange={(e) =>
                    setHandymanData({ ...handymanData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                  placeholder="e.g. Handyman User1"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={handymanData.email}
                  onChange={(e) =>
                    setHandymanData({ ...handymanData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                  placeholder="handyman@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={handymanData.password}
                  onChange={(e) =>
                    setHandymanData({
                      ...handymanData,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                  placeholder="••••••"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowHandymanModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingHandyman}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-900 font-bold rounded-xl text-sm transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50"
                >
                  {creatingHandyman ? "Registering..." : "Add Handyman"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProviderHandymen;
