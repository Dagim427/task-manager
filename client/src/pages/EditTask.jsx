import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import TaskForm from "../components/task/TaskForm.jsx";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useOutletContext() || {};
  const tasks = context.tasks || [];
  const onUpdateTask = context.onUpdateTask || (() => {});

  // Find existing task
  const existingTask = tasks.find((t) => String(t.id) === String(id));

  const handleSubmit = (updatedData) => {
    onUpdateTask(id, updatedData);
    navigate("/dashboard");
  };

  if (!existingTask) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <h2>Task not found</h2>
        <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <TaskForm
      pageTitle="Edit Task"
      submitLabel="Save Changes"
      initial={existingTask}
      onCancel={() => navigate(-1)}
      onSubmit={handleSubmit}
    />
  );
}