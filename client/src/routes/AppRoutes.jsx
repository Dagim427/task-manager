import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<div>Login</div>}
        />

        <Route
          path="/register"
          element={<div>Register</div>}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<div>Dashboard</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;