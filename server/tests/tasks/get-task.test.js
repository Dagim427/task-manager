import request from "supertest";

import app from "../../src/app.js";

import { clearUsersTable } from "../helpers/database.js";

const userA = {
  name: "Get Task User A",
  email: "get-task-a@example.com",
  password: "StrongPassword123!",
};

const userB = {
  name: "Get Task User B",
  email: "get-task-b@example.com",
  password: "StrongPassword123!",
};

const login = async (credentials) => {
  const response = await request(app).post("/api/auth/login").send(credentials);

  return response.body.data.accessToken;
};

describe("GET /api/tasks/:taskId", () => {
  beforeEach(async () => {
    await clearUsersTable();

    await request(app).post("/api/auth/register").send(userA);

    await request(app).post("/api/auth/register").send(userB);
  });

  afterAll(async () => {
    await clearUsersTable();
  });

  it("returns a task owned by the authenticated user", async () => {
    const token = await login(userA);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My task",
        description: "My description",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.task.id).toBe(taskId);
    expect(response.body.data.task.title).toBe("My task");
  });

  it("returns 404 for another user's task", async () => {
    const tokenA = await login(userA);
    const tokenB = await login(userB);

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        title: "Private User B task",
      });

    const taskId = createResponse.body.data.task.id;

    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(response.status).toBe(404);

    expect(response.body.code).toBe("TASK_NOT_FOUND");
  });

  it("rejects an invalid task ID", async () => {
    const token = await login(userA);

    const response = await request(app)
      .get("/api/tasks/not-a-number")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("rejects unauthenticated requests", async () => {
    const response = await request(app).get("/api/tasks/1");

    expect(response.status).toBe(401);
  });
});
