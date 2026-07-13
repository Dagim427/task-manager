import db from "../config/db.js";

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

    // Check user register or not
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        error: "User already register",
      });
    }

    // Register new user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES(?,?,?)",
      [name, email, password],
    );

    // Return success message
    return res.status(201).json({
      success: true,
      message: "User register successfully",
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
