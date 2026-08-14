import bcrypt from "bcryptjs";

import { createUser, findUserByEmail } from "../models/user.model.js";

import { ApiError } from "../utils/ApiError.js";

const BCRYPT_SALT_ROUNDS = 12;

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password_hash: _passwordHash, ...safeUser } = user;

  return safeUser;
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

    return sanitizeUser(user);
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
