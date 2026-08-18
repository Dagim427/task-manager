import { useEffect, useState } from "react";

const INITIAL_FORM = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

function TaskForm({
  task = null,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const [form, setForm] =
    useState(INITIAL_FORM);

  const [errors, setErrors] =
    useState({});

  const isEditMode = Boolean(task);

  useEffect(() => {
    if (!task) {
      setForm(INITIAL_FORM);
      return;
    }

    // Support both camelCase and snake_case for due date and priority from backend
    const rawDueDate = task.dueDate ?? task.due_date;
    const rawPriority = task.priority ?? task.priority_level ?? "medium";

    setForm({
      title: task.title ?? "",
      description: task.description ?? "",
      status: task.status ?? "todo",
      priority: String(rawPriority).toLowerCase(),
      dueDate: rawDueDate
        ? String(rawDueDate).slice(0, 10)
        : "",
    });

    setErrors({});
  }, [task]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title =
        "Title is required.";
    } else if (
      form.title.trim().length > 200
    ) {
      nextErrors.title =
        "Title must not exceed 200 characters.";
    }

    if (form.description.length > 2000) {
      nextErrors.description =
        "Description must not exceed 2000 characters.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      title: form.title.trim(),
      description:
        form.description.trim() || null,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
    });

    if (!isEditMode) {
      setForm(INITIAL_FORM);
      setErrors({});
    }
  };

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="modal-header">
        <div>
          <h3>
            {isEditMode
              ? "Edit task"
              : "Create task"}
          </h3>

          <p>
            {isEditMode
              ? "Update your task details."
              : "Add a new task to your workspace."}
          </p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="form-field">
        <label htmlFor="task-title">
          Title
        </label>

        <input
          id="task-title"
          name="title"
          type="text"
          maxLength={200}
          value={form.title}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.title)}
        />

        {errors.title && (
          <p className="field-error">
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="task-description">
          Description
        </label>

        <textarea
          id="task-description"
          name="description"
          rows={5}
          maxLength={2000}
          value={form.description}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={Boolean(
            errors.description,
          )}
        />

        {errors.description && (
          <p className="field-error">
            {errors.description}
          </p>
        )}
      </div>

      <div className="task-form-row">
        <div className="form-field">
          <label htmlFor="task-status">
            Status
          </label>

          <select
            id="task-status"
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="todo">
              To do
            </option>

            <option value="in_progress">
              In progress
            </option>

            <option value="completed">
              Completed
            </option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="task-priority">
            Priority
          </label>

          <select
            id="task-priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="task-due-date">
          Due date
        </label>

        <input
          id="task-due-date"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditMode
              ? "Saving..."
              : "Creating..."
            : isEditMode
              ? "Save changes"
              : "Create task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;