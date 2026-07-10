import db from '../config/db.js';

// @desc    Get all tasks
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    // This is ready for your database table. 
    // For now, we mock the production response safely.
    const mockTasks = [{ id: 1, title: "Build production foundation", completed: true }];
    
    res.status(200).json({
      success: true,
      count: mockTasks.length,
      data: mockTasks
    });
  } catch (error) {
    console.error(`Error in getTasks: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch tasks'
    });
  }
};

export {}