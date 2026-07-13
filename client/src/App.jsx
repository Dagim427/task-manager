import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Register from './pages/register/Register.jsx';

function App() {
  return (
    <Router>
      <main className="app-container">
        <Routes>
          {/* Route for the Dashboard / Home view */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Route for the Registration page */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;