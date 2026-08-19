import request from "supertest";
import jwt from "jsonwebtoken";

import app from "../../src/app.js";
import pool from "../../src/config/database.js";
import { env } from "../../src/config/env.js";

import { clearUsersTable } from "../helpers/database.js";

const testUser = {
  name: "Authentication Test",
  email: "auth-test@example.com",
  password: "StrongPassword123!",
};

describe("Authentication", () => {
  beforeEach(async () => {
    await clearUsersTable();

    await request(app).post("/api/auth/register").send(testUser);
  });

  afterAll(async () => {
    await clearUsersTable();
  });

  describe("POST /api/auth/login", () => {
    it("logs in with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toEqual(expect.any(String));

      expect(response.body.data.user.email).toBe(testUser.email);

      expect(response.body.data.user.password_hash).toBeUndefined();
    });

    it("rejects an incorrect password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "WrongPassword123!",
      });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
      });
    });

    it("rejects a nonexistent email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "does-not-exist@example.com",
        password: testUser.password,
      });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
      });
    });
  });

  describe("GET /api/auth/me", () => {
    it("returns the authenticated user", async () => {
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      const token = loginResponse.body.data.accessToken;

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it("rejects a request without a token", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);

      expect(response.body.code).toBe("AUTHENTICATION_REQUIRED");
    });

    it("rejects a malformed authorization header", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Invalid token");

      expect(response.status).toBe(401);

      expect(response.body.code).toBe("INVALID_AUTHORIZATION_HEADER");
    });

    it("rejects an invalid JWT", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid.jwt.token");

      expect(response.status).toBe(401);

      expect(response.body.code).toBe("INVALID_TOKEN");
    });

    it("rejects an expired JWT", async () => {
      const token = jwt.sign(
        {
          sub: "1",
          email: testUser.email,
        },
        env.JWT_SECRET,
        {
          expiresIn: -1,
        },
      );

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);
        
      expect(response.status).toBe(401);

      expect(response.body.code).toBe("INVALID_TOKEN");
    });

    it("rejects a token when the user no longer exists", async () => {
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      const token = loginResponse.body.data.accessToken;

      await pool.execute("DELETE FROM users WHERE email = ?", [testUser.email]);

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(401);

      expect(response.body.code).toBe("USER_NOT_FOUND");
    });
  });
});
