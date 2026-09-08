import request from "supertest";

import app from "../../src/app.js";
import { clearUsersTable } from "../helpers/database.js";

const userA = {
  name: "Stats Task User A",
  email: "stats-task-a@example.com",
  password: "StrongPassword123!",
};

const userB = {
  name: "Stats Task User B",
  email: "stats-task-b@example.com",
  password: "StrongPassword123!",
};

const login = async (credentials) => {
  const response = await request(app).post("/api/auth/login").send(credentials);

  expect(response.status).toBe(200);

  return response.body.data.accessToken;
};

const createTask = async (token, task) => {
  const response = await request(app)
    .post("/api/tasks")
    .set("Authorization", `Bearer ${token}`)
    .send(task);

  expect(response.status).toBe(201);

  return response.body.data.task;
};

describe("GET /api/tasks/stats", () => {
  beforeEach(async () => {
    await clearUsersTable();

    await request(app).post("/api/auth/register").send(userA);

    await request(app).post("/api/auth/register").send(userB);
  });

  afterAll(async () => {
    await clearUsersTable();
  });

  it("returns task statistics for the authenticated user", async () => {
    const token = await login(userA);

    await createTask(token, {
      title: "Todo low",
      status: "todo",
      priority: "low",
    });

    await createTask(token, {
      title: "Todo medium",
      status: "todo",
      priority: "medium",
    });

    await createTask(token, {
      title: "In progress high",
      status: "in_progress",
      priority: "high",
    });

    await createTask(token, {
      title: "Completed medium",
      status: "completed",
      priority: "medium",
    });

    await createTask(token, {
      title: "Completed high",
      status: "completed",
      priority: "high",
    });

    const response = await request(app)
      .get("/api/tasks/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.data.stats).toEqual({
      total: 5,
      todo: 2,
      in_progress: 1,
      completed: 2,
      low: 1,
      medium: 2,
      high: 2,
    });
  });

  it("returns zero statistics when the user has no tasks", async () => {
    const token = await login(userA);

    const response = await request(app)
      .get("/api/tasks/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data.stats).toEqual({
      total: 0,
      todo: 0,
      in_progress: 0,
      completed: 0,
      low: 0,
      medium: 0,
      high: 0,
    });
  });

  it("only counts tasks belonging to the authenticated user", async () => {
    const tokenA = await login(userA);
    const tokenB = await login(userB);

    await createTask(tokenA, {
      title: "User A todo",
      status: "todo",
      priority: "low",
    });

    await createTask(tokenB, {
      title: "User B completed",
      status: "completed",
      priority: "high",
    });

    await createTask(tokenB, {
      title: "User B in progress",
      status: "in_progress",
      priority: "medium",
    });

    const response = await request(app)
      .get("/api/tasks/stats")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(response.status).toBe(200);

    expect(response.body.data.stats).toEqual({
      total: 1,
      todo: 1,
      in_progress: 0,
      completed: 0,
      low: 1,
      medium: 0,
      high: 0,
    });
  });

  it("updates statistics after a task is updated", async () => {
    const token = await login(userA);

    const task = await createTask(token, {
      title: "Update statistics task",
      status: "todo",
      priority: "low",
    });

    const before = await request(app)
      .get("/api/tasks/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(before.status).toBe(200);

    expect(before.body.data.stats).toEqual({
      total: 1,
      todo: 1,
      in_progress: 0,
      completed: 0,
      low: 1,
      medium: 0,
      high: 0,
    });

    const updateResponse = await request(app)
      .patch(`/api/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "completed",
        priority: "high",
      });

    expect(updateResponse.status).toBe(200);

    const after = await request(app)
      .get("/api/tasks/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(after.status).toBe(200);

    expect(after.body.data.stats).toEqual({
      total: 1,
      todo: 0,
      in_progress: 0,
      completed: 1,
      low: 0,
      medium: 0,
      high: 1,
    });
  });

  it("updates statistics after a task is deleted", async () => {
    const token = await login(userA);

    const task = await createTask(token, {
      title: "Task to delete",
      status: "completed",
      priority: "high",
    });

    await createTask(token, {
      title: "Task to keep",
      status: "todo",
      priority: "medium",
    });

    const deleteResponse = await request(app)
      .delete(`/api/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(204);

    const response = await request(app)
      .get("/api/tasks/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data.stats).toEqual({
      total: 1,
      todo: 1,
      in_progress: 0,
      completed: 0,
      low: 0,
      medium: 1,
      high: 0,
    });
  });

  it("rejects unauthenticated requests", async () => {
    const response = await request(app).get("/api/tasks/stats");

    expect(response.status).toBe(401);
  });
});
