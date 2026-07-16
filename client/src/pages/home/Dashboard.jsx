import { useAuth } from "../../context/Authcontext.jsx";
import "./dashboard.css";

const Dashboard = () => {
  // Professionally consume global state instead of fetching data locally
  const { user, logout } = useAuth();

  // Fallback guard (ProtectedRoute handles the main check, but this prevents render errors)
  if (!user) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="page-title">Dashboard</h1>

        <div className="user-info-section">
          <h2>Welcome, {user.name}!</h2>
          <div className="user-details">
            <span className="label">Email: </span>
            <span className="value">{user.email}</span>
          </div>
        </div>

        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
