import { describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/server.js";

describe("Lab 3 starter", () => {
  test("GET /health returns status ok", async () => {
    const app = createApp();

    const response = await request(app)
        .get("/health")
        .expect(200);

    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("GET /items", () => {
  test("returns the list of seeded items", async () => {
    const app = createApp();
 
    const response = await request(app)
        .get("/items")
        .expect(200);
 
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([
      { id: 1, name: "keyboard", quantity: 10 },
      { id: 2, name: "mouse", quantity: 5 }
    ]);
  });
});
 
describe("GET /items/:id", () => {
  test("returns a single item when it exists", async () => {
    const app = createApp();
 
    const response = await request(app)
        .get("/items/1")
        .expect(200);
 
    expect(response.body).toEqual({ id: 1, name: "keyboard", quantity: 10 });
  });
 
  test("returns 404 when the item does not exist", async () => {
    const app = createApp();
 
    const response = await request(app)
        .get("/items/999")
        .expect(404);
 
    expect(response.body).toHaveProperty("error");
  });
});
 
describe("POST /items", () => {
  test("creates a new item and returns 201", async () => {
    const app = createApp();
 
    const response = await request(app)
        .post("/items")
        .send({ name: "monitor", quantity: 4 })
        .expect(201);
 
    expect(response.body).toEqual({ id: 3, name: "monitor", quantity: 4 });
 
    // The new item should now be retrievable.
    const followUp = await request(app)
        .get("/items/3")
        .expect(200);
 
    expect(followUp.body).toEqual({ id: 3, name: "monitor", quantity: 4 });
  });
 
  test("returns 400 when required fields are missing", async () => {
    const app = createApp();
 
    const response = await request(app)
        .post("/items")
        .send({ name: "monitor" })
        .expect(400);
 
    expect(response.body).toHaveProperty("error");
  });
});
 
describe("PUT /items/:id", () => {
  test("updates an existing item", async () => {
    const app = createApp();
 
    const response = await request(app)
        .put("/items/1")
        .send({ name: "mechanical keyboard", quantity: 12 })
        .expect(200);
 
    expect(response.body).toEqual({
      id: 1,
      name: "mechanical keyboard",
      quantity: 12
    });
  });
 
  test("returns 404 when updating an item that does not exist", async () => {
    const app = createApp();
 
    const response = await request(app)
        .put("/items/999")
        .send({ name: "ghost", quantity: 1 })
        .expect(404);
 
    expect(response.body).toHaveProperty("error");
  });
 
  test("returns 400 when the body is invalid", async () => {
    const app = createApp();
 
    const response = await request(app)
        .put("/items/1")
        .send({ name: "no quantity" })
        .expect(400);
 
    expect(response.body).toHaveProperty("error");
  });
});
 
describe("DELETE /items/:id", () => {
  test("deletes an existing item and returns 204", async () => {
    const app = createApp();
 
    await request(app)
        .delete("/items/1")
        .expect(204);
 
    // The item should be gone afterward.
    await request(app)
        .get("/items/1")
        .expect(404);
  });
 
  test("returns 404 when deleting an item that does not exist", async () => {
    const app = createApp();
 
    const response = await request(app)
        .delete("/items/999")
        .expect(404);
 
    expect(response.body).toHaveProperty("error");
  });
});
