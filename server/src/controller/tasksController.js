import db from "../config/db.js";

// @desc    Get all tasks for the current user
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
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

// @desc     Create new Task for the current user
// @route    POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const {
      title,
      description = null,
      priority = "medium",
      status = "to do",
      due_date,
      is_important = false,
    } = req.body;

    // validate title
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "please provide title for task",
      });
    }

    // validate due date
    if (!due_date) {
      return res.status(400).json({
        success: false,
        message: "please provide due date for task",
      });
    }

    // insert into database safely using prepare statement (?) to prevent sql injection
    const [result] = await db.query(
      "INSERT INTO tasks (title, description, priority, status, due_date, is_important, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description, priority, status, due_date, is_important, userId],
    );

    // construct the newly created task object
    const newTask = {
      id: result.insertId,
      title: title,
      description: description,
      priority: priority,
      status: status,
      due_date: due_date,
      is_important: is_important,
      user_id: userId,
    };

    res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    console.error(`Error in createTask: ${error.message}`);
    res.status(500).json({ message: "Server Error: unable to create task" });
  }
};

// @desc    Update task status (toggle completed) for the current user
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { completed } = req.body; // Expecting a boolean (true/false)

    // Convert boolean to MySQL tinyint (1 or 0)
    const isCompleted = completed ? 1 : 0;

    const [result] = await db.query(
      "UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?",
      [isCompleted, id, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    console.error(`Error in updateTask: ${error.message}`);
    res
      .status(500)
      .json({ success: false, error: "Server Error: Unable to update task" });
  }
};

// @desc    Delete a task for the current user
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error(`Error in deleteTask: ${error.message}`);
    res
      .status(500)
      .json({ success: false, error: "Server Error: Unable to delete task" });
  }
};
