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

## Reflection Answers

### 1. What changed when the API moved from in-memory data to Postgres?

When the API moves to Postgres, the data itself becomes persistent across server restarts

### 2. When should you use `PUT` instead of `PATCH`?

PUT should be used when the entirety of a resource is being overwritten. PATCH should be used when only segments of the data need to be updated, as opposed to a complete overwrite

### 3. What kinds of validation belong in the API even if the browser client also validates input?

The API handles all forms of validation for routes, parameters, and body data. The API should handle input checking and reject invalid fields while returning the relevant code

### 4. How does the browser client help you test the API differently than `curl` alone?

A browser client helps test the API in a more complete, end-user experience way. Notably, browser client testing will take longer to verify and set up, as opposed to CURL testing. 

### 5. If you added an extension, what did you add and why?

I did not add any extension to the existing feature set
