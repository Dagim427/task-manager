import { registerUser } from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await registerUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        user,
      },
    });
  } catch (error) {
    return next(error);
  }
};
