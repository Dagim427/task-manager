import { useState } from "react";
import { Outlet } from "react-router-dom";
import { C } from "../../utils/color.js";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function Layout({ tasks, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: C.bg }}>
      {/* Mobile Drawer & Overlay Sidebar */}
      <Sidebar
        tasks={tasks}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
