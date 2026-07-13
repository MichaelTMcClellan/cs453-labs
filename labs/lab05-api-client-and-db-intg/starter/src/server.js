import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? 5433),
  database: process.env.PGDATABASE ?? "lab05",
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD ?? "postgres"
});

function parseItemId(value) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateName(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateQuantity(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function badRequest(res, message) {
  return res.status(400).json({
    error: "Bad Request",
    message
  });
}

function notFound(res, id) {
  return res.status(404).json({
    error: "Not Found",
    message: `Item ${id} does not exist.`
  });
}

function internalServerError(res, message) {
  return res.status(500).json({
    error: "Internal Server Error",
    message
  });
}

function validateFullItemBody(body) {
  if (!isPlainObject(body)) {
    return "The request body must be a JSON object.";
  }

  const allowedFields = new Set(["name", "quantity"]);
  const unknownFields = Object.keys(body).filter((key) => !allowedFields.has(key));

  if (unknownFields.length > 0) {
    return `Unknown field(s): ${unknownFields.join(", ")}.`;
  }

  if (!validateName(body.name) || !validateQuantity(body.quantity)) {
    return "A non-empty name and non-negative integer quantity are required.";
  }

  return null;
}

export function createApp(database = pool) {
  const app = express();

  app.use(express.json());

  app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ]
  }));

  app.get("/health", async (req, res) => {
    try {
      await database.query("SELECT 1");
      res.json({ status: "ok" });
    } catch (error) {
      console.error("Health check failed:", error);
      internalServerError(res, "Database connection failed.");
    }
  });

  app.get("/api/items", async (req, res) => {
    try {
      const result = await database.query(`
        SELECT id, name, quantity
        FROM items
        ORDER BY id ASC
      `);

      res.json({ items: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      internalServerError(res, "Failed to load items.");
    }
  });

  app.post("/api/items", async (req, res) => {
    const validationError = validateFullItemBody(req.body);

    if (validationError) {
      return badRequest(res, validationError);
    }

    const name = req.body.name.trim();
    const quantity = req.body.quantity;

    try {
      const result = await database.query(
        `
          INSERT INTO items (name, quantity)
          VALUES ($1, $2)
          RETURNING id, name, quantity
        `,
        [name, quantity]
      );

      res.status(201).json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to add item:", error);
      internalServerError(res, "Failed to add item.");
    }
  });

  app.get("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return badRequest(res, "Item ID must be a positive integer.");
    }

    try {
      const result = await database.query(
        `
          SELECT id, name, quantity
          FROM items
          WHERE id = $1
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return notFound(res, id);
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error(`Failed to load item ${id}:`, error);
      internalServerError(res, "Failed to load the item.");
    }
  });

  app.put("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return badRequest(res, "Item ID must be a positive integer.");
    }

    const validationError = validateFullItemBody(req.body);

    if (validationError) {
      return badRequest(res, validationError);
    }

    const name = req.body.name.trim();
    const quantity = req.body.quantity;

    try {
      const result = await database.query(
        `
          UPDATE items
          SET name = $1, quantity = $2
          WHERE id = $3
          RETURNING id, name, quantity
        `,
        [name, quantity, id]
      );

      if (result.rows.length === 0) {
        return notFound(res, id);
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error(`Failed to replace item ${id}:`, error);
      internalServerError(res, "Failed to replace the item.");
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return badRequest(res, "Item ID must be a positive integer.");
    }

    if (!isPlainObject(req.body)) {
      return badRequest(res, "The request body must be a JSON object.");
    }

    const allowedFields = new Set(["name", "quantity"]);
    const fields = Object.keys(req.body);
    const unknownFields = fields.filter((key) => !allowedFields.has(key));

    if (unknownFields.length > 0) {
      return badRequest(res, `Unknown field(s): ${unknownFields.join(", ")}.`);
    }

    if (fields.length === 0) {
      return badRequest(res, "Provide at least one field to update: name or quantity.");
    }

    if (Object.hasOwn(req.body, "name") && !validateName(req.body.name)) {
      return badRequest(res, "Name must be a non-empty string.");
    }

    if (Object.hasOwn(req.body, "quantity") && !validateQuantity(req.body.quantity)) {
      return badRequest(res, "Quantity must be a non-negative integer.");
    }

    const assignments = [];
    const values = [];

    if (Object.hasOwn(req.body, "name")) {
      values.push(req.body.name.trim());
      assignments.push(`name = $${values.length}`);
    }

    if (Object.hasOwn(req.body, "quantity")) {
      values.push(req.body.quantity);
      assignments.push(`quantity = $${values.length}`);
    }

    values.push(id);

    try {
      const result = await database.query(
        `
          UPDATE items
          SET ${assignments.join(", ")}
          WHERE id = $${values.length}
          RETURNING id, name, quantity
        `,
        values
      );

      if (result.rows.length === 0) {
        return notFound(res, id);
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error(`Failed to update item ${id}:`, error);
      internalServerError(res, "Failed to update the item.");
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return badRequest(res, "Item ID must be a positive integer.");
    }

    try {
      const result = await database.query(
        `
          DELETE FROM items
          WHERE id = $1
          RETURNING id, name, quantity
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return notFound(res, id);
      }

      res.json({
        message: "Item deleted.",
        item: result.rows[0]
      });
    } catch (error) {
      console.error(`Failed to delete item ${id}:`, error);
      internalServerError(res, "Failed to delete the item.");
    }
  });

  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
      return badRequest(res, "The request body contains invalid JSON.");
    }

    console.error("Unhandled request error:", error);
    return internalServerError(res, "An unexpected error occurred.");
  });

  app.use((req, res) => {
    res.status(404).json({
      error: "Not Found",
      message: "The requested route does not exist."
    });
  });

  return app;
}

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity >= 0)
    )
  `);

  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM items");

  if (rows[0].count === 0) {
    await pool.query(
      `
        INSERT INTO items (name, quantity)
        VALUES ($1, $2), ($3, $4), ($5, $6)
      `,
      ["Keyboard", 10, "Mouse", 5, "Monitor", 3]
    );
  }
}

const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  const app = createApp();

  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Lab 5 API listening on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error);
      process.exit(1);
    });
}
