import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const ProviderAuth = ({ onLogin, onSwitchToAdmin, onSwitchToHandyman }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const payload = {
          email: formData.email,
          password: formData.password,
        };
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/providers/data/loginProvider`,
          payload,
        );
        setSuccess("Logged in successfully!");

        const token =
          response.data.token ||
          response.data.accessToken ||
          response.data.data?.token;
        if (token && onLogin) {
          onLogin(token, "provider");
        }
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "provider",
        };
        await axios.post(
          `${API_BASE_URL}/api/v1/providers/data/createProvider`,
          payload,
        );
        setSuccess("Account created successfully! You can now log in.");
        setFormData({ name: "", email: "", password: "" });
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("invalid credential");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "An error occurred. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="absolute top-8 right-8 z-20 flex gap-3 flex-col sm:flex-row">
        <button
          onClick={onSwitchToAdmin}
          className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-medium transition-colors backdrop-blur-md"
        >
          Admin Portal
        </button>
        <button
          onClick={onSwitchToHandyman}
          className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-medium transition-colors backdrop-blur-md"
        >
          Handyman Portal
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 mt-12 sm:mt-0">
        <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-700/50 p-8 rounded-3xl shadow-2xl transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {isLogin ? "Provider Login" : "Provider Registration"}
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              {isLogin
                ? "Sign in to manage your services and bookings"
                : "Create an account to manage your handymen"}
            </p>
          </div>

          {(error || success) && (
            <div
              className={`p-4 rounded-xl mb-6 text-sm font-medium border ${error ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"}`}
            >
              {error || success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  placeholder="e.g. Jane Doe"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                placeholder="provider@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-300">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {isLogin ? "Authenticating..." : "Registering..."}
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors focus:outline-none"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderAuth;
