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

function useTasks() {
  const [tasks, setTasks] = useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isCreating, setIsCreating] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] = useState("");

  const loadTasks = useCallback(
    async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getTasks();
        const rawTasks = response.tasks ?? response.data?.tasks ?? response ?? [];

        setTasks(Array.isArray(rawTasks) ? rawTasks.filter(Boolean) : []);
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
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await getTasks();
        const rawTasks = response.tasks ?? response.data?.tasks ?? response ?? [];

        if (isMounted) {
          setTasks(Array.isArray(rawTasks) ? rawTasks.filter(Boolean) : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data
              ?.message ??
              "Unable to load tasks.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

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
    [],
  );

  return {
    tasks,
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