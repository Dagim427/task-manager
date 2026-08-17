import { useEffect, useMemo, useState } from "react";

import Modal from "../../components/common/modal";
import TaskForm from "../../components/task/TaskForm";
import { createTask, getTasks } from "../../services/task.service";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "todo", label: "To do" },
  {
    value: "in_progress",
    label: "In progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "All priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [isCreating, setIsCreating] = useState(false);

  const [createError, setCreateError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getTasks();

        if (isMounted) {
          setTasks(response.data?.tasks ?? response.tasks ?? []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ?? "Unable to load tasks.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateTask = async (taskData) => {
    setIsCreating(true);
    setCreateError("");

    try {
      const response = await createTask(taskData);

      const newTask = response.data?.task ?? response.task;

      setTasks((current) => [newTask, ...current]);

      setIsCreateOpen(false);
    } catch (requestError) {
      setCreateError(
        requestError.response?.data?.message ?? "Unable to create task.",
      );

      throw requestError;
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !normalizedSearch ||
        task.title?.toLowerCase().includes(normalizedSearch) ||
        task.description?.toLowerCase().includes(normalizedSearch);

      const matchesStatus = status === "all" || task.status === status;

      const matchesPriority = priority === "all" || task.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, status, priority]);

  return (
    <section>
      <div className="page-heading">
        <div>
          <h2>Tasks</h2>

          <p>Manage and organize your tasks.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            setCreateError("");
            setIsCreateOpen(true);
          }}
        >
          + New Task
        </button>
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <div className="task-toolbar">
        <div className="search-field">
          <label htmlFor="task-search" className="sr-only">
            Search tasks
          </label>

          <input
            id="task-search"
            type="search"
            placeholder="Search tasks..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="status-filter">Status</label>

          <select
            id="status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="priority-filter">Priority</label>

          <select
            id="priority-filter"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="task-table-container">
        {isLoading ? (
          <div className="empty-state">
            <p>Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <h4>No tasks found</h4>

            <p>Try changing your filters or create a new task.</p>
          </div>
        ) : (
          <div className="task-table-wrapper">
            <table className="task-table">
              <thead>
                <tr>
                  <th scope="col">Task</th>
                  <th scope="col">Status</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Due date</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div className="task-title-cell">
                        <strong>{task.title}</strong>

                        {task.description && <span>{task.description}</span>}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`task-status task-status-${task.status}`}
                      >
                        {formatStatus(task.status)}
                      </span>
                    </td>

                    <td>
                      <span className={`priority priority-${task.priority}`}>
                        {formatPriority(task.priority)}
                      </span>
                    </td>

                    <td>{formatDate(task.dueDate)}</td>

                    <td>
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={`Actions for ${task.title}`}
                      >
                        ⋯
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreateOpen && (
        <Modal
          title="Create task"
          onClose={() => {
            if (!isCreating) {
              setIsCreateOpen(false);
            }
          }}
        >
          {createError && (
            <div className="form-error" role="alert">
              {createError}
            </div>
          )}

          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => {
              setIsCreateOpen(false);
            }}
            isSubmitting={isCreating}
          />
        </Modal>
      )}
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

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default TasksPage;