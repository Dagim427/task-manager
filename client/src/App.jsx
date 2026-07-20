import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Layouts

// Pages
import Register from "./pages/auth/registeration/Register.jsx";
import Login from "./pages/auth/login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
// import Taskboard from "./pages/tasks/Taskboard.jsx";
import Layout from "./components/layout/Layout.jsx";

// A clean component to protect private routes
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   // Tip: Replace this div with a professional full-page Spinner component later
//   if (loading) return <div className="page-loader">Loading...</div>;
//   if (!user) return <Navigate to="/login" replace />;

//   return children;
// };

function App() {
  return (
    <Router>
      {/* <AuthProvider>
        <Routes>
          {/* 
            PUBLIC ROUTES
            These render without the Sidebar/Header 
          */}
      {/* 
          
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          */}

      {/* 
            PROTECTED ROUTES
            Wrapped in MainLayout to provide persistent Sidebar and Header
          */}

      {/* <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          > */}
      {/* These child routes inject into the <Outlet /> inside MainLayout
            <Route path="/task" element={<Taskboard />} />
            
            {/* Default redirect for authenticated users hitting the root path */}
      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route> */}
      {/* Fallback route */}
      {/* 
          
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider> */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
