import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";

function App() {
  return (
    <Router>
      <main className="app-container">
        <Routes>
          {/* Route for the Dashboard / Home view */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
