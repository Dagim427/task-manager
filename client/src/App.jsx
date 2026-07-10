import { useState, useEffect } from 'react';
import apiClient from './api/axios.js';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await apiClient.get('/tasks');
        if (response.data.success) {
          setTasks(response.data.data);
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Could not connect to the production server.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#4F46E5' }}>Production Task Manager</h1>
      
      {loading && <p>Loading tasks safely...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ padding: '12px', background: '#fff', border: '1px solid #ddd', marginBottom: '8px', borderRadius: '4px' }}>
            <strong>{task.title}</strong> - {task.completed ? '✅ Done' : '❌ Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;