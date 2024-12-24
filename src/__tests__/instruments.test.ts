import request from "supertest";
import app from "../app";
import Instrument from "../models/Instrument";
import { disconnectFromMongo } from "../utils/mongoConnection";

const seedTestData = async () => {
  await Instrument.deleteMany({});
  await Instrument.insertMany([
    {
      symbol: "AAPL",
      type: "stock",
      name: "Apple",
      currency: "USD",
      region: "US",
      country: "USA",
    },
    {
      symbol: "GOOGL",
      type: "stock",
      name: "Google",
      currency: "USD",
      region: "US",
      country: "USA",
    },
  ]);
};

beforeAll(async () => {
  await seedTestData();
});

afterAll(async () => {
  await disconnectFromMongo();
});

describe("Instruments API", () => {
  it("should return paginated instruments", async () => {
    const response = await request(app).get("/api/instruments?page=1&limit=10");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("page", 1);
    expect(response.body).toHaveProperty("totalPages");
  }, 30000); // Increased timeout to 30 seconds

  it("should return filtered instruments", async () => {
    const response = await request(app).get("/api/instruments?search=stock");
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it("should return an error for invalid query parameters", async () => {
    const response = await request(app).get("/api/instruments?page=-1");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });
});
