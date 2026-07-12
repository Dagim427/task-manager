import db from "../config/db.js";

// @desc    Get all tasks
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM tasks ORDER BY created_at DESC",
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error(`Error from get Task: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server Error: unable to fetch get tasks",
    });
  }
};

// @desc     Create new Task
// @route    POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    // validate title
    if (!title) {
      return res.status(400).json({
        success: false,
        error: "please provide title for task",
      });
    }

    // insert into database safely using prepare statement (?) to prevent sql injection
    const [result] = await db.query("INSERT INTO tasks (title) VALUES (?)", [title]);

    // construct the newly created task object
   const newTask = {
      id: result.insertId,
      title: title,
      completed: 0 // MySQL stores booleans as 0 (false) and 1 (true)
    };

    res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    console.error(`Error in createTask: ${error.message}`);
    res.status(500).json({ error: "Server Error: unable to create task" });
  }
};

// @desc    Update task status (toggle completed)
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body; // Expecting a boolean (true/false)

    // Convert boolean to MySQL tinyint (1 or 0)
    const isCompleted = completed ? 1 : 0;

    const [result] = await db.query('UPDATE tasks SET completed = ? WHERE id = ?', [isCompleted, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task updated successfully' });
  } catch (error) {
    console.error(`Error in updateTask: ${error.message}`);
    res.status(500).json({ success: false, error: 'Server Error: Unable to update task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error(`Error in deleteTask: ${error.message}`);
    res.status(500).json({ success: false, error: 'Server Error: Unable to delete task' });
  }
};