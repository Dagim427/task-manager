import { useEffect, useState } from "react";

import { getTasks, getTaskStats } from "../../services/task.service";

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    in_progress: 0,
    completed: 0,
    low: 0,
    medium: 0,
    high: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [tasksResponse, statsData] = await Promise.all([
          getTasks(),
          getTaskStats(),
        ]);

        if (isMounted) {
          setTasks(tasksResponse.data?.tasks ?? tasksResponse.tasks ?? []);
          setStats(statsData);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ?? "Unable to load dashboard data.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <div className="page-heading">
        <div>
          <h2>Dashboard</h2>

          <p>Overview of your task management.</p>
        </div>
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <div className="dashboard-stats">
        <article className="stat-card">
          <span>Total tasks</span>
          <strong>{isLoading ? "—" : stats.total}</strong>
        </article>

        <article className="stat-card">
          <span>To do</span>
          <strong>{isLoading ? "—" : stats.todo}</strong>
        </article>

        <article className="stat-card">
          <span>In progress</span>
          <strong>{isLoading ? "—" : stats.in_progress}</strong>
        </article>

        <article className="stat-card">
          <span>Completed</span>
          <strong>{isLoading ? "—" : stats.completed}</strong>
        </article>
      </div>

      <section className="task-section">
        <div className="section-heading">
          <h3>My Tasks</h3>
        </div>

        {isLoading ? (
          <div className="empty-state">
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <h4>No tasks yet</h4>

            <p>Create your first task to get started.</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.slice(0, 5).map((task) => (
              <article className="task-item" key={task.id}>
                <div>
                  <h4>{task.title}</h4>

                  {task.description && <p>{task.description}</p>}
                </div>
                
                <span className={`priority priority-${task.priority}`}>
                  {formatPriority(task.priority)}
                </span>

                <span className={`task-status task-status-${task.status}`}>
                  {formatStatus(task.status)}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function formatStatus(status) {
  const labels = {
    todo: "To do",
    in_progress: "In progress",
    completed: "Completed",
  };

  return labels[status] ?? status;
}

function formatPriority(priority) {
  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return labels[priority] ?? priority;
}

export default DashboardPage;