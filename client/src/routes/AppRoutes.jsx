import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<div>Login</div>}
        />

        <Route
          path="/register"
          element={<div>Register</div>}
        />

        <Route
          path="/dashboard"
          element={<div>Dashboard</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;