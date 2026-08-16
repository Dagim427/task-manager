import request from "supertest";

import app from "../../src/app.js";

import {
  clearUsersTable,
  closeDatabase,
} from "../helpers/database.js";

const user = {
  name: "Delete Task User",
  email: "delete-task@example.com",
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

describe("DELETE /api/tasks/:taskId", () => {
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

  it("deletes a task owned by the authenticated user", async () => {
    const token = await login();

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Task to delete",
      });

    const taskId =
      createResponse.body.data.task.id;

    const deleteResponse = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getResponse.status).toBe(404);

    expect(getResponse.body.code).toBe(
      "TASK_NOT_FOUND",
    );
  });

  it("returns 404 when the task does not exist", async () => {
    const token = await login();

    const response = await request(app)
      .delete("/api/tasks/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);

    expect(response.body.code).toBe(
      "TASK_NOT_FOUND",
    );
  });

  it("rejects unauthenticated requests", async () => {
    const response = await request(app)
      .delete("/api/tasks/1");

    expect(response.status).toBe(401);
  });

  it("cannot delete another user's task", async () => {
    const userA = {
      name: "User A",
      email: "delete-a@example.com",
      password: "StrongPassword123!",
    };

    const userB = {
      name: "User B",
      email: "delete-b@example.com",
      password: "StrongPassword123!",
    };

    await request(app)
      .post("/api/auth/register")
      .send(userA);

    await request(app)
      .post("/api/auth/register")
      .send(userB);

    const loginA = await request(app)
      .post("/api/auth/login")
      .send({
        email: userA.email,
        password: userA.password,
      });

    const loginB = await request(app)
      .post("/api/auth/login")
      .send({
        email: userB.email,
        password: userB.password,
      });

    const tokenA = loginA.body.data.accessToken;
    const tokenB = loginB.body.data.accessToken;

    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        title: "Private User B task",
      });

    const taskId =
      createResponse.body.data.task.id;

    const deleteResponse = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(deleteResponse.status).toBe(404);

    const ownerResponse = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(ownerResponse.status).toBe(200);

    expect(
      ownerResponse.body.data.task.title,
    ).toBe("Private User B task");
  });
});