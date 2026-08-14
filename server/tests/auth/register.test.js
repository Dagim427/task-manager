import request from "supertest";

import app from "../../src/app.js";
import pool from "../../src/config/database.js";

import { clearUsersTable, closeDatabase } from "../helpers/database.js";

describe("POST /api/auth/register", () => {
  beforeEach(async () => {
    await clearUsersTable();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it("creates a new user successfully", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "StrongPassword123!",
    });

    expect(response.status).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "User registered successfully.",
        data: expect.objectContaining({
          user: expect.objectContaining({
            name: "Test User",
            email: "test@example.com",
          }),
        }),
      }),
    );

    expect(response.body.data.user.password).toBeUndefined();

    expect(response.body.data.user.password_hash).toBeUndefined();
  });

  it("stores the user in the database", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Database Test",
      email: "database@example.com",
      password: "StrongPassword123!",
    });

    const [rows] = await pool.execute(
      `
        SELECT id, name, email, password_hash
        FROM users
        WHERE email = ?
      `,
      ["database@example.com"],
    );

    expect(rows).toHaveLength(1);

    expect(rows[0].name).toBe("Database Test");
    expect(rows[0].email).toBe("database@example.com");

    expect(rows[0].password_hash).not.toBe("StrongPassword123!");

    expect(rows[0].password_hash).toMatch(/^\$2[aby]\$/);
  });

  it("returns 409 when the email already exists", async () => {
    await request(app).post("/api/auth/register").send({
      name: "First User",
      email: "duplicate@example.com",
      password: "StrongPassword123!",
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Second User",
      email: "duplicate@example.com",
      password: "AnotherPassword123!",
    });

    expect(response.status).toBe(409);

    expect(response.body).toEqual({
      success: false,
      message: "An account with this email already exists.",
      code: "EMAIL_ALREADY_EXISTS",
    });
  });

  it("normalizes the email address", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "TEST@EXAMPLE.COM",
      password: "StrongPassword123!",
    });

    expect(response.status).toBe(201);

    expect(response.body.data.user.email).toBe("test@example.com");
  });

  it("rejects invalid input", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "",
      email: "invalid-email",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
