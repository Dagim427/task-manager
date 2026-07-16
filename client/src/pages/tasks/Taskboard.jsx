import { useTasks } from "../../hooks/useTasks.js"; 
import TaskForm from "../../components/tasks/TaskFrom.jsx";
import TaskItem from "../../components/tasks/TaskItem.jsx";

const Taskboard = () => {
  const { tasks, loading, error, addTask, toggleTask, deleteTask } = useTasks();

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Task Manager Dashboard</h1>

      <TaskForm onAddTask={addTask} />

      {/* Render states */}
      {loading && <p className="status-message">Loading tasks safely...</p>}
      {error && <p className="status-error">{error}</p>}

      {/* Render tasks */}
      {!loading && tasks.length === 0 && (
        <p className="status-message">No tasks found. Add one above!</p>
      )}

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div>
  );
};

export default Taskboard;