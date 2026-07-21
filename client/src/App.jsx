import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Layout from "./components/layout/Layout.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 2. Layout Wrapper (All routes inside share Sidebar & Header) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-tasks" element={<Dashboard />} />
            <Route path="/completed" element={<Dashboard />} />
            <Route path="/important" element={<Dashboard />} />
            {/* <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} /> */}
          </Route>

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;