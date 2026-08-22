import request from "supertest";
import app from "../../src/app.js";
import { clearUsersTable } from "../helpers/database.js";

const userA = {
  name: "Update Task User A",
  email: "update-task-a@example.com",
  password: "StrongPassword123!",
};

const userB = {
  name: "Update Task User B",
  email: "update-task-b@example.com",
  password: "StrongPassword123!",
};

const login = async (credentials) => {
  const response = await request(app).post("/api/auth/login").send(credentials);

  return response.body.data.accessToken;
};

describe("PATCH /api/tasks/:taskId", () => {
  beforeEach(async () => {
    await clearUsersTable();

    await request(app).post("/api/auth/register").send(userA);

    await request(app).post("/api/auth/register").send(userB);
  });

  afterAll(async () => {
    await clearUsersTable();
  });

  it("updates a task owned by the authenticated user", async () => {
    const token = await login(userA);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Original title",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated title",
        description: "Updated description",
        status: "in_progress",
        priority: "low",
        dueDate: "2026-08-25T18:00:00Z",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.task.title).toBe("Updated title");
    expect(response.body.data.task.description).toBe("Updated description");
    expect(response.body.data.task.status).toBe("in_progress");
    expect(response.body.data.task.priority).toBe("low");
  });

  it("cannot update another user's task", async () => {
    const tokenA = await login(userA);
    const tokenB = await login(userB);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        title: "User B private task",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        title: "Malicious update",
        description: "Should not work",
        status: "completed",
        priority: "high",
        dueDate: null,
      });

    expect(response.status).toBe(404);
    expect(response.body.code).toBe("TASK_NOT_FOUND");
  });

  it("rejects an invalid task status", async () => {
    const token = await login(userA);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Status test",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated",
        description: "Test",
        status: "invalid_status",
        priority: "invalid priority",
        dueDate: null,
      });

    expect(response.status).toBe(400);
  });

  it("updates only the provided field", async () => {
    const token = await login(userA);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Original title",
        priority: "medium",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "completed",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.task.status).toBe("completed");
    expect(response.body.data.task.title).toBe("Original title");
    expect(response.body.data.task.priority).toBe("medium");
  });

  it("updates only priority", async () => {
    const token = await login(userA);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Priority Test",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        priority: "high",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.task.priority).toBe("high");
  });

  it("rejects an invalid status", async () => {
    const token = await login(userA);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Invalid Status Test",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "random_status",
      });

    expect(response.status).toBe(400);
  });

  it("rejects an empty update", async () => {
    const token = await login(userA);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Empty Update Test",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("clears the description when description is null", async () => {
    const accessToken = await login(userA);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Task with description",
        description: "Initial description",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        description: null,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.task.description).toBeNull();
  });

  it("clears the due date when dueDate is null", async () => {
    const accessToken = await login(userA);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Task with due date",
        dueDate: "2026-08-30T18:00:00Z",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        dueDate: null,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.task.due_date).toBeNull();
  });

  it("does not change nullable fields when they are omitted", async () => {
    const accessToken = await login(userA);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Task preservation test",
        description: "Original description",
        dueDate: "2026-08-30T18:00:00.000Z",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status: "completed",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.task.status).toBe("completed");
    expect(response.body.data.task.description).toBe("Original description");
    expect(response.body.data.task.due_date).toContain("2026-08-30");
  });
});