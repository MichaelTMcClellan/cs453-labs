import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const port = 3000;
const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE ?? "cs453",
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD ?? "postgres"
});

app.use(express.json());

// This allows the browser client at localhost:5173 to read API responses.
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: allowedOrigins
}));

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);

  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM items");

  if (rows[0].count === 0) {
    await pool.query(
      "INSERT INTO items (name) VALUES ($1), ($2), ($3)",
      ["Notebook", "Pencil", "Coffee"]
    );
  }
}

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed."
    });
  }
});

app.get("/api/items", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM items ORDER BY id ASC"
    );

    res.json({ items: result.rows });
  } catch (error) {
    console.error("Failed to load items:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to load items from the database."
    });
  }
});

app.post("/api/items", async (req, res) => {
  const name = req.body?.name?.trim();

  if (!name) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Item name is required."
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO items (name) VALUES ($1) RETURNING id, name",
      [name]
    );

    res.status(201).json({ item: result.rows[0] });
  } catch (error) {
    console.error("Failed to add item:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to save item to the database."
    });
  }
});

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(port, () => {
      console.log(`Demo API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
