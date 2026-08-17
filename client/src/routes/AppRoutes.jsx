import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/auth/LoginPage";

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
          element={<LoginPage />}
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