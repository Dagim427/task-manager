import {
  loginUser,
  registerUser,
  getUserById,
} from "../services/auth.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { accessToken, user } = await registerUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully.",
    data: {
      accessToken,
      user,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, user } = await loginUser({
    email: req.body.email,
    password: req.body.password,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      accessToken,
      user,
    },
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  if (!user) {
    throw new ApiError(401, "User account no longer exists.", "USER_NOT_FOUND");
  }

  return res.status(200).json({
    success: true,
    message: "Current user retrieved successfully.",
    data: {
      user,
    },
  });
});
