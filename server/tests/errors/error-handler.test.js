import request from "supertest";

import app from "../../src/app.js";

import {
  clearUsersTable,
  closeDatabase,
} from "../helpers/database.js";

const user = {
  name: "Error Test User",
  email: "error-test@example.com",
  password: "StrongPassword123!",
};

const login = async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: user.email,
      password: user.password,
    });

  return response.body.data.accessToken;
};

describe("Error Handler Tests", () => {
  beforeEach(async () => {
    await clearUsersTable();

    await request(app)
      .post("/api/auth/register")
      .send(user);
  });

  afterAll(async () => {
    await clearUsersTable();
    await closeDatabase();
  });

  it("returns a consistent 404 error", async () => {
    const token = await login();

    const response = await request(app)
      .get("/api/tasks/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      message: "Task not found.",
      code: "TASK_NOT_FOUND",
    });
  });

  it("returns a consistent validation error", async () => {
    const token = await login();

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe(
      "VALIDATION_ERROR",
    );

    expect(response.body.details).toEqual(
      expect.any(Array),
    );
  });
});