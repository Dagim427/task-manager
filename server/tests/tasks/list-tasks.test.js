import request from "supertest";

import app from "../../src/app.js";
import { clearUsersTable } from "../helpers/database.js";

const userA = {
  name: "List Task User A",
  email: "list-task-a@example.com",
  password: "StrongPassword123!",
};

const userB = {
  name: "List Task User B",
  email: "list-task-b@example.com",
  password: "StrongPassword123!",
};

const login = async (credentials) => {
  const response = await request(app)
    .post("/api/auth/login")
    .send(credentials);

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

describe("GET /api/tasks", () => {
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
  });

  it("returns the authenticated user's tasks", async () => {
    const token = await login(userA);

    await createTask(token, {
      title: "First task",
      description: "First description",
    });

    await createTask(token, {
      title: "Second task",
      description: "Second description",
    });

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.data.tasks).toHaveLength(2);

    expect(response.body.data.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
    });

    expect(
      response.body.data.tasks.map((task) => task.title),
    ).toEqual(
      expect.arrayContaining([
        "First task",
        "Second task",
      ]),
    );
  });

  it("does not return another user's tasks", async () => {
    const tokenA = await login(userA);
    const tokenB = await login(userB);

    await createTask(tokenA, {
      title: "User A private task",
    });

    await createTask(tokenB, {
      title: "User B private task",
    });

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(response.status).toBe(200);

    expect(response.body.data.pagination.total).toBe(1);
    expect(response.body.data.tasks).toHaveLength(1);

    expect(response.body.data.tasks[0].title).toBe(
      "User A private task",
    );
  });

  it("supports pagination", async () => {
    const token = await login(userA);

    for (let i = 1; i <= 5; i += 1) {
      await createTask(token, {
        title: `Pagination task ${i}`,
      });
    }

    const firstPage = await request(app)
      .get("/api/tasks?page=1&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(firstPage.status).toBe(200);

    expect(firstPage.body.data.tasks).toHaveLength(2);

    expect(firstPage.body.data.pagination).toEqual({
      page: 1,
      limit: 2,
      total: 5,
      totalPages: 3,
    });

    const secondPage = await request(app)
      .get("/api/tasks?page=2&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(secondPage.status).toBe(200);

    expect(secondPage.body.data.tasks).toHaveLength(2);
    expect(secondPage.body.data.pagination.page).toBe(2);

    const firstIds = firstPage.body.data.tasks.map(
      (task) => task.id,
    );

    const secondIds = secondPage.body.data.tasks.map(
      (task) => task.id,
    );

    expect(firstIds).not.toEqual(
      expect.arrayContaining(secondIds),
    );
  });

  it("returns an empty page when the requested page is beyond the last page", async () => {
    const token = await login(userA);

    await createTask(token, {
      title: "Only task",
    });

    const response = await request(app)
      .get("/api/tasks?page=2&limit=1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data.tasks).toEqual([]);

    expect(response.body.data.pagination).toEqual({
      page: 2,
      limit: 1,
      total: 1,
      totalPages: 1,
    });
  });

  it("supports search by title", async () => {
    const token = await login(userA);

    await createTask(token, {
      title: "Build authentication API",
    });

    await createTask(token, {
      title: "Design dashboard",
    });

    const response = await request(app)
      .get("/api/tasks?search=authentication")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data.pagination.total).toBe(1);
    expect(response.body.data.tasks).toHaveLength(1);

    expect(response.body.data.tasks[0].title).toBe(
      "Build authentication API",
    );
  });

  it("supports search by description", async () => {
    const token = await login(userA);

    await createTask(token, {
      title: "Backend task",
      description: "Implement JWT authentication",
    });

    await createTask(token, {
      title: "Frontend task",
      description: "Build dashboard layout",
    });

    const response = await request(app)
      .get("/api/tasks?search=JWT")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data.pagination.total).toBe(1);
    expect(response.body.data.tasks).toHaveLength(1);

    expect(response.body.data.tasks[0].title).toBe(
      "Backend task",
    );
  });

  it("supports status filtering", async () => {
    const token = await login(userA);

    await createTask(token, {
      title: "Todo task",
      status: "todo",
    });

    await createTask(token, {
      title: "In progress task",
      status: "in_progress",
    });

    await createTask(token, {
      title: "Completed task",
      status: "completed",
    });

    const response = await request(app)
      .get("/api/tasks?status=completed")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data.pagination.total).toBe(1);
    expect(response.body.data.tasks).toHaveLength(1);

    expect(response.body.data.tasks[0].status).toBe(
      "completed",
    );

    expect(response.body.data.tasks[0].title).toBe(
      "Completed task",
    );
  });

  it("supports priority filtering", async () => {
    const token = await login(userA);

    await createTask(token, {
      title: "Low priority",
      priority: "low",
    });

    await createTask(token, {
      title: "Medium priority",
      priority: "medium",
    });

    await createTask(token, {
      title: "High priority",
      priority: "high",
    });

    const response = await request(app)
      .get("/api/tasks?priority=high")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data.pagination.total).toBe(1);
    expect(response.body.data.tasks).toHaveLength(1);

    expect(response.body.data.tasks[0].priority).toBe(
      "high",
    );

    expect(response.body.data.tasks[0].title).toBe(
      "High priority",
    );
  });

  it("supports combined search, status, and priority filters", async () => {
    const token = await login(userA);

    await createTask(token, {
      title: "Urgent API work",
      description: "Backend authentication",
      status: "in_progress",
      priority: "high",
    });

    await createTask(token, {
      title: "Urgent UI work",
      description: "Frontend authentication",
      status: "todo",
      priority: "high",
    });

    await createTask(token, {
      title: "Normal API work",
      description: "Backend database",
      status: "in_progress",
      priority: "medium",
    });

    const response = await request(app)
      .get(
        "/api/tasks?search=API&status=in_progress&priority=high",
      )
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.data.pagination.total).toBe(1);
    expect(response.body.data.tasks).toHaveLength(1);

    expect(response.body.data.tasks[0].title).toBe(
      "Urgent API work",
    );

    expect(response.body.data.tasks[0].status).toBe(
      "in_progress",
    );

    expect(response.body.data.tasks[0].priority).toBe(
      "high",
    );
  });

  it("rejects an invalid page", async () => {
    const token = await login(userA);

    const response = await request(app)
      .get("/api/tasks?page=0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("rejects an invalid limit", async () => {
    const token = await login(userA);

    const response = await request(app)
      .get("/api/tasks?limit=101")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("rejects an invalid status filter", async () => {
    const token = await login(userA);

    const response = await request(app)
      .get("/api/tasks?status=invalid_status")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("rejects an invalid priority filter", async () => {
    const token = await login(userA);

    const response = await request(app)
      .get("/api/tasks?priority=urgent")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("rejects a search longer than 100 characters", async () => {
    const token = await login(userA);

    const longSearch = "a".repeat(101);

    const response = await request(app)
      .get(`/api/tasks?search=${longSearch}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("rejects unauthenticated requests", async () => {
    const response = await request(app)
      .get("/api/tasks");

    expect(response.status).toBe(401);
  });
});