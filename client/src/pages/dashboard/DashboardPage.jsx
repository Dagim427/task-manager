function DashboardPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <h2>Dashboard</h2>
          <p>
            Overview of your task management.
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        <article className="stat-card">
          <span>Total tasks</span>
          <strong>0</strong>
        </article>

        <article className="stat-card">
          <span>To do</span>
          <strong>0</strong>
        </article>

        <article className="stat-card">
          <span>In progress</span>
          <strong>0</strong>
        </article>

        <article className="stat-card">
          <span>Completed</span>
          <strong>0</strong>
        </article>
      </div>

      <section className="task-section">
        <div className="section-heading">
          <h3>My Tasks</h3>
        </div>

        <div className="empty-state">
          <h4>No tasks yet</h4>
          <p>
            Create your first task to get started.
          </p>
        </div>
      </section>
    </section>
  );
}

export default DashboardPage;