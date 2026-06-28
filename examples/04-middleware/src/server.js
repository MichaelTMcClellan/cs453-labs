import "dotenv/config";
import express from "express";

import { requestLogger } from "./middleware/requestLogger.js";
import { addRequestId } from "./middleware/requestId.js";
import { requireApiKey } from "./middleware/requireApiKey.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = process.env.PORT ?? 3000;

// Built-in middleware for JSON request bodies.
app.use(express.json());

// Application-level middleware.
app.use(addRequestId);
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    requestId: req.requestId
  });
});

app.get("/api/items", (req, res) => {
  res.json({
    requestId: req.requestId,
    items: [
      { id: 1, name: "Notebook" },
      { id: 2, name: "Pencil" },
      { id: 3, name: "Coffee" }
    ]
  });
});

// Route-level middleware. Only routes below this line require the API key.
app.use("/api/admin", requireApiKey);

app.get("/api/admin/status", (req, res) => {
  res.json({
    requestId: req.requestId,
    status: "admin route reached",
    message: "The API key middleware allowed this request."
  });
});

app.get("/api/broken", (req, res, next) => {
  next(new Error("This route intentionally throws an error."));
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Middleware example running on http://localhost:${port}`);
});
