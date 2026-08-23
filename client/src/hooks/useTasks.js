import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask as updateTaskRequest,
} from "../services/task.service";

const DEFAULT_LIMIT = 20;

function useTasks({
  search = "",
  status = "",
  priority = "",
} = {}) {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getTasks({
        page,
        limit: DEFAULT_LIMIT,
        search,
        status,
        priority,
      });

      const rawTasks =
        response.data?.tasks ??
        response.tasks ??
        [];

      const rawPagination =
        response.data?.pagination ??
        response.pagination ?? {
          page,
          limit: DEFAULT_LIMIT,
          total: rawTasks.length,
          totalPages: 1,
        };

      setTasks(
        Array.isArray(rawTasks)
          ? rawTasks.filter(Boolean)
          : [],
      );

      setPagination(rawPagination);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          "Unable to load tasks.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status, priority]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadTasks();
    });
  }, [loadTasks]);

  const createTask = useCallback(
    async (data) => {
      setIsCreating(true);
      setError("");

      try {
        const response =
          await createTaskRequest(data);

        const newTask =
          response.data?.task ??
          response.task ??
          response;

        try {
          await loadTasks();
        } catch {
          // Fallback if loadTasks fails
        }

        setTasks((current) => {
          const exists = current.some((t) => t.id === newTask.id);
          return exists ? current : [newTask, ...current];
        });

        return newTask;
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ??
            "Unable to create task.",
        );

        throw requestError;
      } finally {
        setIsCreating(false);
      }
    },
    [loadTasks],
  );

  const updateTask = useCallback(
    async (taskId, data) => {
      setIsUpdating(true);
      setError("");

      try {
        const response =
          await updateTaskRequest(
            taskId,
            data,
          );

        const updatedTask =
          response.data?.task ??
          response.task ??
          response;

        try {
          await loadTasks();
        } catch {
          // Fallback if loadTasks fails
        }

        setTasks((current) =>
          current.map((task) =>
            task.id === taskId
              ? { ...task, ...updatedTask, ...data }
              : task,
          ),
        );

        return updatedTask;
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ??
            "Unable to update task.",
        );

        throw requestError;
      } finally {
        setIsUpdating(false);
      }
    },
    [loadTasks],
  );

  const removeTask = useCallback(
    async (taskId) => {
      setIsDeleting(true);
      setError("");

      try {
        await deleteTaskRequest(taskId);

        if (tasks.length === 1 && page > 1) {
          setPage(
            (currentPage) => currentPage - 1,
          );
        } else {
          try {
            await loadTasks();
          } catch {
            setTasks((current) =>
              current.filter(
                (task) => task.id !== taskId,
              ),
            );
          }
        }
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ??
            "Unable to delete task.",
        );

        throw requestError;
      } finally {
        setIsDeleting(false);
      }
    },
    [tasks.length, page, loadTasks],
  );

  return {
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
  };
}

export default useTasks;