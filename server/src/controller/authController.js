import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    // Validate password length (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({
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

// @disc    - Login user
// @route   - POST  /api/auth/login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required field
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    // Validate email format using Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    // Validate password length (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long",
      });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials.",
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials.",
      });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(`Error in login User: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Server Error: Unable to login  user",
    });
  }
};
