import request from "supertest";

import app from "../../src/app.js";
// import pool from "../../src/config/database.js";

import {
  clearUsersTable,
  closeDatabase,
} from "../helpers/database.js";

const userA = {
  name: "Task User A",
  email: "task-user-a@example.com",
  password: "StrongPassword123!",
};

const userB = {
  name: "Task User B",
  email: "task-user-b@example.com",
  password: "StrongPassword123!",
};

const login = async (credentials) => {
  const response = await request(app)
    .post("/api/auth/login")
    .send(credentials);

  return response.body.data.accessToken;
};

describe("POST /api/tasks", () => {
  beforeEach(async () => {
    await clearUsersTable();

    await request(app)
      .post("/api/auth/register")
      .send(userA);

    await request(app)
      .post("/api/auth/register")
      .send(userB);
  });

  afterAll(async () => {
    await clearUsersTable();
    await closeDatabase();
  });

  it("creates a task for the authenticated user", async () => {
    const token = await login(userA);

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Build production API",
        description: "Implement task creation",
        dueDate: "2026-08-20T18:00:00Z",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    expect(response.body.data.task.title).toBe(
      "Build production API",
    );

    expect(response.body.data.task.description).toBe(
      "Implement task creation",
    );

    expect(response.body.data.task.status).toBe("todo");
    expect(response.body.data.task.user_id).toBeDefined();
  });

  it("creates a task with the default todo status", async () => {
    const token = await login(userA);

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Default status test",
      });

    expect(response.status).toBe(201);

    expect(response.body.data.task.status).toBe(
      "todo",
    );
  });

  it("rejects a request without authentication", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({
        title: "Unauthorized task",
      });

    expect(response.status).toBe(401);
  });

  it("rejects a missing title", async () => {
    const token = await login(userA);

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Missing title",
      });

    expect(response.status).toBe(400);
  });

  it("rejects an invalid status", async () => {
    const token = await login(userA);

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Invalid status",
        status: "deleted",
      });

    expect(response.status).toBe(400);
  });

  it("does not allow the client to choose the task owner", async () => {
    const tokenA = await login(userA);
    const tokenB = await login(userB);

    const userBResponse = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${tokenB}`);

    const userBId = userBResponse.body.data.user.id;

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        title: "Ownership test",
        userId: userBId,
      });

    expect(response.status).toBe(201);

    expect(
      response.body.data.task.user_id,
    ).not.toBe(userBId);
  });
});