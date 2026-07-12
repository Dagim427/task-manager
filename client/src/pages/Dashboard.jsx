import { useTasks } from "../hooks/useTasks.js";
import TaskForm from "../components/tasks/TaskFrom.jsx"
import TaskItem from "../components/tasks/TaskItem.jsx";

const Dashboard = () => {
  // We extract all the logic into this custom hook
  const { tasks, loading, error, addTask, toggleTask, deleteTask } = useTasks();

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Task Manager Dashboard</h1>

      {/* Form component receives the addTask function */}
      <TaskForm onAddTask={addTask} />

      {/* Conditional rendering for loading and error states */}
      {loading && <p className="status-message">Loading tasks safely...</p>}
      {error && <p className="status-error">{error}</p>}

      {/* The list renders the items, passing down the toggle/delete handlers */}
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

export default Dashboard;
