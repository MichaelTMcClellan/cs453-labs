import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());

  // Starter data. This data is stored in memory and will reset when the
  // server restarts.
  let nextId = 3;
  const items = [
    { id: 1, name: "keyboard", quantity: 10 },
    { id: 2, name: "mouse", quantity: 5 }
  ];

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // TODO: Return all items.
  app.get("/items", (req, res) => {
    res.status(501).json({ error: "Not implemented yet" });
  });

  // TODO: Return one item by ID.
  app.get("/items/:id", (req, res) => {
    res.status(501).json({ error: "Not implemented yet" });
  });

  // TODO: Create a new item.
  app.post("/items", (req, res) => {
    res.status(501).json({ error: "Not implemented yet" });
  });

  // TODO: Update an existing item.
  app.put("/items/:id", (req, res) => {
    res.status(501).json({ error: "Not implemented yet" });
  });

  // TODO: Delete an existing item.
  app.delete("/items/:id", (req, res) => {
    res.status(501).json({ error: "Not implemented yet" });
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Lab 3 REST API listening on port ${PORT}`);
  });
}
