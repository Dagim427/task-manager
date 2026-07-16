import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios"; // Adjust path based on your folder structure

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Fetch the current user (Axios interceptor adds the Bearer token)
        const response = await apiClient.get("/auth/me");
        
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        
        // If the token is invalid or missing (401), clear storage and redirect
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // Logout handler for convenience
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  // Fallback if user state isn't set but redirect hasn't triggered yet
  if (!user) {
    return null; 
  }

  return (
    <div className="dashboard-container" style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      
      {/* Display the user's name and email */}
      <h2>Welcome, {user.name}!</h2>
      <div style={{ margin: "10px 0" }}>
        <strong>Email: </strong>
        <span>{user.email}</span>
      </div>

      <button 
        onClick={handleLogout} 
        style={{ marginTop: "20px", padding: "8px 16px", cursor: "pointer" }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;