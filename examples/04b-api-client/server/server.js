import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());

// This allows the browser client at localhost:5173 to read API responses.
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: allowedOrigins
}));

let nextId = 4;
const items = [
  { id: 1, name: "Notebook" },
  { id: 2, name: "Pencil" },
  { id: 3, name: "Coffee" }
];

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/items", (req, res) => {
  res.json({ items });
});

app.post("/api/items", (req, res) => {
  const name = req.body?.name?.trim();

  if (!name) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Item name is required."
    });
  }

  const item = {
    id: nextId,
    name
  };

  nextId += 1;
  items.push(item);

  res.status(201).json({ item });
});

app.listen(port, () => {
  console.log(`Demo API running on http://localhost:${port}`);
});
