# Lab 5 Starter

## How to Run

```bash
npm install
docker compose up -d
npm run api
npm run client
```

Open:

```text
http://localhost:5173
```

Postgres is exposed on:

```text
postgres://postgres:postgres@localhost:5433/lab05
```

## What Already Works

- Postgres runs in Docker.
- The Express server connects to Postgres.
- The server creates and seeds an `items` table on startup.
- `GET /health`, `GET /api/items`, and `POST /api/items` are implemented.
- The browser client can load items and add a new item.

## What You Need to Add

- `GET /api/items/:id`
- `PUT /api/items/:id`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`
- Better validation and error handling
- Client-side UI for at least some of the new routes

## Graduate Extension

Add one more resource or relationship, such as categories, projects, or tags,
and connect it to the database.

## Reflection Answers

### 1. What changed when the API moved from in-memory data to Postgres?

TODO

### 2. When should you use `PUT` instead of `PATCH`?

TODO

### 3. What kinds of validation belong in the API even if the browser client also validates input?

TODO

### 4. How does the browser client help you test the API differently than `curl` alone?

TODO

### 5. If you added an extension, what did you add and why?

TODO
