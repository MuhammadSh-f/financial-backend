import request from "supertest";
import app from "../app";
import { disconnectFromMongo } from "../utils/mongoConnection.js";

describe("Health Check Endpoint", () => {
  afterAll(async () => {
    await disconnectFromMongo();
  });

  it("should return API status and database status", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("database");
  });
});
