import request from "supertest";

import app from "../../src/app.js";

describe("Health checks", () => {
  it("reports that the application is alive", async () => {
    const response = await request(app).get("/health/live");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      status: "ok",
    });
  });

  it("reports that the application is ready", async () => {
    const response = await request(app).get("/health/ready");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      status: "ready",
    });
  });
});
