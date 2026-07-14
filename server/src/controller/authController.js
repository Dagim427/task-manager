import db from "../config/db.js";
import bcrypt from "bcryptjs";

// @disc    - Register new user
// @route   - POST  /api/auth/register

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required field
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email, password",
      });
    }

    // Validate email format using Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Please provide a valid email address",
        });
    }

    // Validate password length (minimum 8 characters)
    if (password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Password must be at least 8 characters long",
        });
    }

    // Check user register or not
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        error: "User is already registered.",
      });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Register new user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES(?,?,?)",
      [name, email, hashedPassword],
    );

    // Return success message
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        id: result.insertId,
        name,
        email,
      },
    });
  } catch (error) {
    console.error(`Error in registerUser: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server Error: Unable to register user",
    });
  }
};
