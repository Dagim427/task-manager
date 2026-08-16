import request from "supertest";
import app from "../../src/app.js";
import { clearUsersTable, closeDatabase } from "../helpers/database.js";

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

describe("PUT /api/tasks/:taskId", () => {
  beforeEach(async () => {
    await clearUsersTable();

    await request(app).post("/api/auth/register").send(userA);

    await request(app).post("/api/auth/register").send(userB);
  });

  afterAll(async () => {
    await clearUsersTable();
    await closeDatabase();
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
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated title",
        description: "Updated description",
        status: "in_progress",
        dueDate: "2026-08-25T18:00:00Z",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.task.title).toBe("Updated title");
    expect(response.body.data.task.description).toBe("Updated description");
    expect(response.body.data.task.status).toBe("in_progress");
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
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        title: "Malicious update",
        description: "Should not work",
        status: "completed",
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
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated",
        description: "Test",
        status: "invalid_status",
        dueDate: null,
      });

    expect(response.status).toBe(400);
  });
});
