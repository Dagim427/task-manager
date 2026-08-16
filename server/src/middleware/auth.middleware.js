import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const authenticate = (req, _res, next) => {
  try {
    const authorization = req.get("Authorization");

    if (!authorization) {
      throw new ApiError(
        401,
        "Authentication required.",
        "AUTHENTICATION_REQUIRED",
      );
    }

    const [scheme, token] = authorization.split(" ");

    if (
      scheme !== "Bearer" ||
      !token ||
      authorization.split(" ").length !== 2
    ) {
      throw new ApiError(
        401,
        "Invalid authorization header.",
        "INVALID_AUTHORIZATION_HEADER",
      );
    }

    const payload = jwt.verify(token, env.JWT_SECRET);

    if (typeof payload !== "object" || !payload.sub || !payload.email) {
      throw new ApiError(401, "Invalid authentication token.", "INVALID_TOKEN");
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    return next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return next(
        new ApiError(
          401,
          "Invalid or expired authentication token.",
          "INVALID_TOKEN",
        ),
      );
    }

    return next(error);
  }
};
