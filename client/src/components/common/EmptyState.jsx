function EmptyState({
  title = "No tasks found",
  message = "Create a task to get started.",
  action,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <h3>{title}</h3>

        <p>{message}</p>

        {action}
      </div>
    </div>
  );
}

export default EmptyState;