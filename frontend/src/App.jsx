import React, { useState, useEffect } from "react";
import AdminAuth from "./components/AdminAuth";
import AdminProfile from "./components/AdminProfile";
import ProviderAuth from "./components/ProviderAuth";
import ProviderProfile from "./components/ProviderProfile";
import HandymanAuth from "./components/HandymanAuth";
import HandymanProfile from "./components/HandymanProfile";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState("admin");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get("role");
    const activeRole =
      urlRole === "provider" || urlRole === "handyman" ? urlRole : "admin";
    setRole(activeRole);

    const storedToken = localStorage.getItem(`${activeRole}Token`);
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (newToken, loggedInRole) => {
    const activeRole = loggedInRole || role;
    setToken(newToken);
    localStorage.setItem(`${activeRole}Token`, newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem(`${role}Token`);
  };

  const switchPortal = (targetRole) => {
    const newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      `?role=${targetRole}`;
    window.open(newUrl, "_blank");
  };

  if (token) {
    if (role === "admin")
      return <AdminProfile token={token} onLogout={handleLogout} />;
    if (role === "provider")
      return <ProviderProfile token={token} onLogout={handleLogout} />;
    if (role === "handyman")
      return <HandymanProfile token={token} onLogout={handleLogout} />;
  }

  return (
    <div className="antialiased text-slate-200">
      {role === "handyman" ? (
        <HandymanAuth
          onLogin={handleLogin}
          onSwitchToAdmin={() => switchPortal("admin")}
          onSwitchToProvider={() => switchPortal("provider")}
        />
      ) : role === "provider" ? (
        <ProviderAuth
          onLogin={handleLogin}
          onSwitchToAdmin={() => switchPortal("admin")}
          onSwitchToHandyman={() => switchPortal("handyman")}
        />
      ) : (
        <AdminAuth
          onLogin={handleLogin}
          onSwitchToProvider={() => switchPortal("provider")}
          onSwitchToHandyman={() => switchPortal("handyman")}
        />
      )}
    </div>
  );
}

export default App;
