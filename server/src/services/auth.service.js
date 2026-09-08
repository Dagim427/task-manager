import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../models/user.model.js";

import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

const BCRYPT_SALT_ROUNDS = 12;

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password_hash: _passwordHash, ...safeUser } = user;

  return safeUser;
};

const createAccessToken = (user) => {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );
};

export const registerUser = async ({ name, email, password }) => {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new ApiError(
      409,
      "An account with this email already exists.",
      "EMAIL_ALREADY_EXISTS",
    );
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  try {
    const user = await createUser({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
    });

    const safeUser = sanitizeUser(user);
    const accessToken = createAccessToken(user);

    return {
      accessToken,
      user: safeUser,
    };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new ApiError(
        409,
        "An account with this email already exists.",
        "EMAIL_ALREADY_EXISTS",
      );
    }

    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password.",
      "INVALID_CREDENTIALS",
    );
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new ApiError(
      401,
      "Invalid email or password.",
      "INVALID_CREDENTIALS",
    );
  }

  const accessToken = createAccessToken(user);
  return {
    accessToken,
    user: sanitizeUser(user),
  };
};

export const getUserById = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    return null;
  }

  return sanitizeUser(user);
};
