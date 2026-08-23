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

  const loadTasks = useCallback(
    async () => {
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

        const rawTasks = response.tasks ?? response.data?.tasks ?? response ?? [];
        const rawPagination = response.pagination ?? response.data?.pagination ?? {
          page: 1,
          limit: DEFAULT_LIMIT,
          total: rawTasks.length,
          totalPages: 1,
        };

        setTasks(Array.isArray(rawTasks) ? rawTasks.filter(Boolean) : []);
        setPagination(rawPagination);
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ??
            "Unable to load tasks.",
        );

        throw requestError;
      } finally {
        setIsLoading(false);
      }
    },
    [page, search, status, priority],
  );

  useEffect(() => {
    queueMicrotask(() => {
      void loadTasks().catch(() => {
        // Suppress unhandled rejection warning during error-handling tests
      });
    });
  }, [loadTasks]);

  const createTask = useCallback(
    async (data) => {
      setIsCreating(true);
      setError("");

      try {
        const response =
          await createTaskRequest(data);

        const newTask = response.task ?? response.data?.task ?? response;

        setTasks((current) => [
          newTask,
          ...current,
        ]);

        return newTask;
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ??
            "Unable to create task.",
        );

        throw requestError;
      } finally {
        setIsCreating(false);
      }
    },
    [],
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

        const updatedTask = response.task ?? response.data?.task ?? response;

        setTasks((current) =>
          current.map((task) =>
            task.id === taskId
              ? updatedTask
              : task,
          ),
        );

        return updatedTask;
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ??
            "Unable to update task.",
        );

        throw requestError;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  const removeTask = useCallback(
    async (taskId) => {
      setIsDeleting(true);
      setError("");

      try {
        await deleteTaskRequest(taskId);

        setTasks((current) =>
          current.filter(
            (task) => task.id !== taskId,
          ),
        );
        void loadTasks();
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ??
            "Unable to delete task.",
        );

        throw requestError;
      } finally {
        setIsDeleting(false);
      }
    },
    [loadTasks],
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