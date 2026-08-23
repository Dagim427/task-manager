import { useEffect, useState } from "react";

import Modal from "../../components/common/modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import TaskForm from "../../components/task/TaskForm";
import TaskStatusSelect from "../../components/task/TaskStatusSelect";
import useTasks from "../../hooks/useTasks";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
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
  { value: "", label: "All priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function TasksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priority, setPriority] = useState("");

  const {
    tasks,
    pagination,
    page,
    setPage,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    setError,
    loadTasks,
    createTask,
    updateTask,
    removeTask,
  } = useTasks({
    search,
    status: statusFilter,
    priority,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState("");

  const [editingTask, setEditingTask] = useState(null);
  const [editError, setEditError] = useState("");

  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, priority, setPage]);

  const handleStatusChange = async (task, nextStatus) => {
    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description ?? null,
        status: nextStatus,
        priority: task.priority ?? task.priority_level ?? "medium",
        dueDate: task.dueDate ?? task.due_date ?? null,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ?? "Unable to update task status.",
      );

      throw requestError;
    }
  };

  const handleCreateTask = async (taskData) => {
    setCreateError("");

    try {
      await createTask(taskData);

      setIsCreateOpen(false);
    } catch (requestError) {
      setCreateError(
        requestError.response?.data?.message ?? "Unable to create task.",
      );

      throw requestError;
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) {
      return;
    }

    setDeleteError("");

    try {
      await removeTask(deletingTask.id);

      setDeletingTask(null);
    } catch (requestError) {
      setDeleteError(
        requestError.response?.data?.message ?? "Unable to delete task.",
      );
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) {
      return;
    }

    setEditError("");

    try {
      await updateTask(editingTask.id, taskData);

      setEditingTask(null);
    } catch (requestError) {
      setEditError(
        requestError.response?.data?.message ?? "Unable to update task.",
      );

      throw requestError;
    }
  };

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "" ||
    priority !== "";

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
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
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
          <LoadingState message="Loading tasks..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadTasks} />
        ) : tasks.length === 0 ? (
          <EmptyState
            title={
              hasFilters
                ? "No tasks match your filters."
                : "No tasks yet."
            }
            message={
              hasFilters
                ? "Try changing your search or filters."
                : "Create your first task to get started."
            }
            action={
              !hasFilters && (
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
              )
            }
          />
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
                {tasks.map((task) => {
                  const rawPriority =
                    task.priority ?? task.priority_level ?? task.priorityLevel;
                  const normalizedPriority = rawPriority
                    ? String(rawPriority).trim().toLowerCase()
                    : "medium";
                  const dueDateValue = task.dueDate ?? task.due_date;

                  return (
                    <tr key={task.id}>
                      <td>
                        <div className="task-title-cell">
                          <strong>{task.title}</strong>

                          {task.description && <span>{task.description}</span>}
                        </div>
                      </td>

                      <td>
                        <TaskStatusSelect
                          task={task}
                          onChange={handleStatusChange}
                        />
                      </td>

                      <td>
                        <span
                          className={`priority priority-${normalizedPriority}`}
                        >
                          {formatPriority(rawPriority)}
                        </span>
                      </td>

                      <td>{formatDate(dueDateValue)}</td>

                      <td>
                        <div className="task-actions">
                          <button
                            type="button"
                            className="text-button"
                            onClick={() => {
                              setEditError("");
                              setEditingTask(task);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="text-button danger-text"
                            onClick={() => {
                              setDeleteError("");
                              setDeletingTask(task);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination?.totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="secondary-button"
            disabled={page <= 1 || isLoading}
            onClick={() =>
              setPage((currentPage) =>
                currentPage - 1,
              )
            }
          >
            Previous
          </button>

          <span>
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </span>

          <button
            type="button"
            className="secondary-button"
            disabled={
              page >= pagination.totalPages ||
              isLoading
            }
            onClick={() =>
              setPage((currentPage) =>
                currentPage + 1,
              )
            }
          >
            Next
          </button>
        </div>
      )}

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

      {editingTask && (
        <Modal
          title="Edit task"
          onClose={() => {
            if (!isUpdating) {
              setEditingTask(null);
            }
          }}
        >
          {editError && (
            <div className="form-error" role="alert">
              {editError}
            </div>
          )}

          <TaskForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => {
              setEditingTask(null);
            }}
            isSubmitting={isUpdating}
          />
        </Modal>
      )}

      {deletingTask && (
        <ConfirmDialog
          title="Delete task?"
          message={`Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone.`}
          confirmLabel="Delete task"
          cancelLabel="Cancel"
          onConfirm={handleDeleteTask}
          onCancel={() => {
            if (!isDeleting) {
              setDeletingTask(null);
              setDeleteError("");
            }
          }}
          isConfirming={isDeleting}
          error={deleteError}
        />
      )}
    </section>
  );
}

function formatPriority(priority) {
  if (!priority) return "—";

  const normalized = String(priority).trim().toLowerCase();

  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return labels[normalized] ?? priority;
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