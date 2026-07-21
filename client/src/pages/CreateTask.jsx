import { useNavigate } from "react-router-dom";
import TaskForm from "../components/task/TaskForm.jsx";
import { useTask } from "../hooks/useTasks.js";

export default function CreateTask() {
  const navigate = useNavigate();
  const { createTask, loading, error, success, clearError } = useTask();

  const handleSubmit = async (taskData) => {
    return await createTask(taskData);
  };

  return (
    <>
     
      <TaskForm
        pageTitle="Create Task"
        submitLabel={loading ? "Creating..." : "Create Task"}
        onCancel={() => navigate(-1)}
        onSubmit={handleSubmit}
        success={success}
        error={error}
        clearError={clearError}
      />
    </>
  );
}
