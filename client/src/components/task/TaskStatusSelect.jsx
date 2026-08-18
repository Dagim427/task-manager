import { useState } from "react";

const STATUS_OPTIONS = [
  {
    value: "todo",
    label: "To do",
  },
  {
    value: "in_progress",
    label: "In progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

function TaskStatusSelect({
  task,
  onChange,
  disabled = false,
}) {
  const [isUpdating, setIsUpdating] =
    useState(false);

  const handleChange = async (event) => {
    const nextStatus = event.target.value;

    if (nextStatus === task.status) {
      return;
    }

    setIsUpdating(true);

    try {
      await onChange(task, nextStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={task.status}
      onChange={handleChange}
      disabled={disabled || isUpdating}
      aria-label={`Change status for ${task.title}`}
      className={`status-select status-select-${task.status}`}
    >
      {STATUS_OPTIONS.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default TaskStatusSelect;