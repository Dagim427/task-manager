const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <li className="task-item">
      {/* Rely on CSS classes for strike-throughs and colors instead of inline styles */}
      <span className={`task-title ${task.completed ? "task-completed" : ""}`}>
        {task.title}
      </span>
      
      <div className="task-actions">
        <button 
          onClick={() => onToggle(task.id, task.completed)}
          className={`badge ${task.completed ? "badge-done" : "badge-pending"}`}
        >
          {task.completed ? "Undo" : "Complete"}
        </button>

        <button 
          onClick={() => onDelete(task.id)}
          className="btn-delete"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;