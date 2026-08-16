import {
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  getTask as getTaskService,
  getTasks as getTasksService,
  updateTask as updateTaskService,
} from "../services/task.service.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await createTaskService({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: {
        task,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 20;

    const result = await getTasksService({
      userId: req.user.id,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await getTaskService({
      taskId: req.params.taskId,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Task retrieved successfully.",
      data: {
        task,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await updateTaskService({
      taskId: req.params.taskId,
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      dueDate: req.body.dueDate,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: {
        task,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await deleteTaskService({
      taskId: req.params.taskId,
      userId: req.user.id,
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};