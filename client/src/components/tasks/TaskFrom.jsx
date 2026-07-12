import { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAddTask(title);
    setTitle(''); 
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input 
        className="task-input"
        type="text" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?" 
      />
      <button className="task-button" type="submit">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;