const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <li className="task-item">
      <span 
        className="task-title" 
        style={{ 
          textDecoration: task.completed ? 'line-through' : 'none', 
          color: task.completed ? '#9CA3AF' : '#333' 
        }}
      >
        {task.title}
      </span>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button 
          onClick={() => onToggle(task.id, task.completed)}
          className={`badge ${task.completed ? 'badge-done' : 'badge-pending'}`}
          style={{ border: 'none', cursor: 'pointer' }}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>

        <button 
          onClick={() => onDelete(task.id)}
          style={{ 
            padding: '4px 8px', 
            borderRadius: '12px', 
            border: 'none', 
            backgroundColor: '#FEE2E2', 
            color: '#991B1B', 
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;