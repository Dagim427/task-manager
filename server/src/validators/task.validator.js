import { body, param, query } from "express-validator";

export const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .bail()
    .isString()
    .withMessage("Title must be a string.")
    .bail()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters."),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Description must be a string.")
    .bail()
    .isLength({ max: 5000 })
    .withMessage("Description must not exceed 5000 characters."),

  body("status")
    .optional()
    .isIn(["todo", "in_progress", "completed"])
    .withMessage("Status must be todo, in_progress, or completed."),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high."),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date.")
    .toDate(),
];

export const taskIdValidator = [
  param("taskId")
    .isInt({ min: 1 })
    .withMessage("Task ID must be a positive integer.")
    .bail()
    .toInt(),
];

export const updateTaskValidator = [
  ...taskIdValidator,

  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty.")
    .isLength({ max: 200 })
    .withMessage("Title must not exceed 200 characters."),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Description must be a string.")
    .bail()
    .isLength({ max: 5000 })
    .withMessage("Description must not exceed 5000 characters."),

  body("status")
    .optional()
    .isIn(["todo", "in_progress", "completed"])
    .withMessage("Status must be todo, in_progress, or completed."),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high."),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date."),
];

export const listTasksValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer.")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100.")
    .toInt(),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search must not exceed 100 characters."),

  query("status")
    .optional()
    .isIn(["todo", "in_progress", "completed"])
    .withMessage("Status must be todo, in_progress, or completed."),

  query("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high."),
];
