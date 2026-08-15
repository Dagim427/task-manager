import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Email must not exceed 255 characters.")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password must be a string.")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be between 8 and 72 characters."),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .bail()
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("Email must not exceed 255 characters."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isLength({ max: 72 })
    .withMessage("Password must not exceed 72 characters."),
];
