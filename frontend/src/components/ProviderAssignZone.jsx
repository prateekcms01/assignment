import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const ProviderAssignZone = ({ token }) => {
  const [handymen, setHandymen] = useState([]);
  const [zones, setZones] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedHandyman, setSelectedHandyman] = useState("");
  const [selectedZone, setSelectedZone] = useState("");

  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/providers/data/getProviderHandymanZones`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAssignments(
        response.data.assignments || response.data.data || response.data || [],
      );
    } catch (err) {
      console.error("Failed to fetch zone assignments", err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const fetchDropdownData = async () => {
    setLoading(true);
    try {
      const [handymenRes, zonesRes] = await Promise.all([
        axios.get(
          `${API_BASE_URL}/api/v1/providers/data/getProviderHandymen`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
        axios.get(`${API_BASE_URL}/api/v1/providers/data/getZones`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setHandymen(handymenRes.data.handymen || handymenRes.data.data || []);
      setZones(zonesRes.data.zones || zonesRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch data for zone assignment form", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDropdownData();
      fetchAssignments();
    }
  }, [token]);

  const handleAssignZone = async (e) => {
    e.preventDefault();
    if (!selectedHandyman || !selectedZone) {
      setError("Please select both a handyman and a zone.");
      return;
    }

    setAssigning(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        handyman_id: parseInt(selectedHandyman, 10),
        zone_id: parseInt(selectedZone, 10),
      };

      await axios.post(
        `${API_BASE_URL}/api/v1/providers/data/assignZoneToHandyman`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSuccess("Zone effectively mapped to handyman!");

      setSelectedHandyman("");
      setSelectedZone("");
      fetchAssignments();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to assign zone.",
      );
    } finally {
      setAssigning(false);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (
      !window.confirm("Are you certain you want to remove this assigned zone?")
    )
      return;
    try {
      await axios.delete(
        `${API_BASE_URL}/api/v1/providers/data/deleteHandymanZone/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchAssignments();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete assignment.",
      );
      console.error(err);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Operational Zones
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Assign operating locations/cities to your handymen staff.
          </p>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 mb-8">
        {(error || success) && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-medium border ${error ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"}`}
          >
            {error || success}
          </div>
        )}

        <form
          onSubmit={handleAssignZone}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end"
        >
          <div className="md:col-span-5 space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Select Handyman
            </label>
            <div className="relative">
              <select
                value={selectedHandyman}
                onChange={(e) => setSelectedHandyman(e.target.value)}
                disabled={loading || handymen.length === 0}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none disabled:opacity-50"
              >
                <option value="">
                  {loading
                    ? "Loading handymen..."
                    : handymen.length === 0
                      ? "No handymen available"
                      : "Choose a handyman"}
                </option>
                {handymen.map((hm) => (
                  <option key={hm.id || hm._id} value={hm.id || hm._id}>
                    {hm.name} ({hm.email})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
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
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Select Zone (City)
            </label>
            <div className="relative">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                disabled={loading || zones.length === 0}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none disabled:opacity-50"
              >
                <option value="">
                  {loading
                    ? "Loading zones..."
                    : zones.length === 0
                      ? "No zones available"
                      : "Choose a zone"}
                </option>
                {zones.map((zone) => (
                  <option key={zone.id || zone._id} value={zone.id || zone._id}>
                    {zone.name} - {zone.city}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
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
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={
                loading || assigning || !selectedHandyman || !selectedZone
              }
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {assigning ? (
                <svg
                  className="animate-spin h-4 w-4"
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
              ) : (
                "Assign"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 border-t border-slate-700/50 pt-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Current Zone Mappings
        </h3>

        {loadingAssignments ? (
          <div className="py-8 flex justify-center text-indigo-500/50">
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
        ) : assignments.length === 0 ? (
          <div className="py-8 text-center rounded-2xl bg-slate-800/30 border border-slate-700/50 border-dashed">
            <p className="text-slate-400 text-sm">No zone assignments found.</p>
            <p className="text-slate-500 text-xs mt-1">
              Use the form above to deploy a handyman to an operational zone.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment) => (
              <div
                key={assignment.id || assignment._id}
                className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 p-5 rounded-2xl transition-all group flex flex-col items-start"
              >
                <div className="flex items-start gap-4 w-full">
                  <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-300">
                    <svg
                      className="w-5 h-5 text-indigo-400"
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
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
                      {assignment.zone_name ||
                        assignment.name ||
                        "Assigned Zone"}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-400">
                      <svg
                        className="w-4 h-4 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                      <span>
                        {assignment.handyman_name || "Handyman Staff"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full border-t border-slate-700/50 mt-4 pt-3 flex justify-between items-center text-xs text-slate-500">
                  <span>Mapping Ref #{assignment.id || assignment._id}</span>
                  <div className="flex gap-3 items-center">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium tracking-wide">
                      Deployed
                    </span>
                    <button
                      onClick={() =>
                        handleDeleteAssignment(assignment.id || assignment._id)
                      }
                      className="text-red-400 hover:text-red-300 font-medium transition-colors"
                    >
                      Unassign
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderAssignZone;
