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

  // find an item by its numeric id. Returns the item or undefined.
  function findItem(id) {
    return items.find((item) => item.id === id);
  }

  function validateBody(body) {
    if (body === undefined || body === null || typeof body !== "object") {
      return "Request body must be a JSON object";
    }
 
    if (typeof body.name !== "string" || body.name.trim() === "") {
      return "Field 'name' is required and must be a non-empty string";
    }
 
    if (typeof body.quantity !== "number" || Number.isNaN(body.quantity)) {
      return "Field 'quantity' is required and must be a number";
    }
 
    return null;
  }

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Return all items.
  app.get("/items", (req, res) => {
    res.json(items);
  });

  // Return one item by ID.
  app.get("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = findItem(id);
 
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
 
    res.json(item);
  });

  // Create a new item.
  app.post("/items", (req, res) => {
    const error = validateBody(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
 
    const newItem = {
      id: nextId++,
      name: req.body.name,
      quantity: req.body.quantity
    };
 
    items.push(newItem);
    res.status(201).json(newItem);
  });

  // Update an existing item. PUT replaces name and quantity.
  app.put("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = findItem(id);
 
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
 
    const error = validateBody(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
 
    item.name = req.body.name;
    item.quantity = req.body.quantity;
 
    res.json(item);
  });

  // Delete an existing item.
  app.delete("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = items.findIndex((item) => item.id === id);
 
    if (index === -1) {
      return res.status(404).json({ error: "Item not found" });
    }
 
    items.splice(index, 1);
    res.status(204).end();
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
