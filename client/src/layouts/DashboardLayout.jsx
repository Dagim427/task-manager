import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand-row">
          <div className="sidebar-brand">Task Manager</div>
          <button
            type="button"
            className="sidebar-close-button"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-navigation" aria-label="Main navigation">
          <NavLink
            to="/dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            Tasks
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>

          <button type="button" onClick={logout} className="logout-button">
            Sign out
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      <div className="dashboard-content">
        <header className="dashboard-header">
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>
          <h1>Task Manager</h1>
        </header>

        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;