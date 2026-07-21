import { useNavigate, useOutletContext } from "react-router-dom";
import TaskForm from "../components/task/TaskForm.jsx";

export default function CreateTask() {
  const navigate = useNavigate();
  const context = useOutletContext() || {};
  const onAddTask = context.onAddTask || (() => {});

  const handleSubmit = (taskData) => {
    onAddTask({
      id: Date.now(), // generate simple unique ID
      ...taskData,
    });
    navigate("/dashboard");
  };

  return (
    <TaskForm
      pageTitle="Create Task"
      submitLabel="Create Task"
      onCancel={() => navigate(-1)}
      onSubmit={handleSubmit}
    />
  );
}