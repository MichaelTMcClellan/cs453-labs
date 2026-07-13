# Lab 5 - API Client and Database Integration

## Overview

In this lab, you will start with a small full-stack application:

- a browser client served on one port
- an Express API served on another port
- a Postgres database running in Docker

The starter already demonstrates the basic integration path. The browser can
load items from the API and create a new item. The API connects to Postgres,
creates a table if needed, and stores data in the database instead of in memory.

Your job is to extend this starting point into a more complete REST-style API.
You should add additional routes, update the client to use some of them, and
practice thinking about resource design, validation, and status codes.

This should stay small. The goal is not to build a semester project here. The
goal is to get comfortable with the client/server/database boundary in a
manageable codebase.

## Learning Goals

By the end of this lab, you should be able to:

- Run a Postgres database with Docker Compose.
- Connect an Express server to Postgres using `pg`.
- Read and write rows with SQL from route handlers.
- Keep a browser client and API on separate origins and handle CORS correctly.
- Extend an API beyond simple `GET` and `POST` routes.
- Use `PUT`, `PATCH`, and `DELETE` with appropriate status codes.
- Design at least one small resource well enough to support full CRUD behavior.

## Starter Structure

The starter directory includes:

- `client/` for a plain browser client using `fetch`
- `src/server.js` for the Express API
- `docker-compose.yml` for Postgres
- `package.json` for the API and client scripts

The starter already implements:

- `GET /health`
- `GET /api/items`
- `POST /api/items`

The starter client can:

- load items
- submit a new item

The starter database setup:

- creates an `items` table
- seeds a few example rows when the table is empty

## Your Task

Use the starter as a base and extend it.

At minimum, implement the following additional routes:

| Method | Route | Description |
|---|---|---|
| GET | `/api/items/:id` | Return one item by ID |
| PUT | `/api/items/:id` | Replace one item |
| PATCH | `/api/items/:id` | Partially update one item |
| DELETE | `/api/items/:id` | Delete one item |

Your implementation should:

- validate route parameters and request bodies
- return JSON responses
- use reasonable status codes
- return a `404` response when an item does not exist
- distinguish between invalid input and missing resources
- continue using Postgres as the source of truth

## Suggested Scope

Keep the data model simple. For example, an item can have:

```json
{
  "id": 1,
  "name": "Keyboard",
  "quantity": 10
}
```

You may add fields if they are useful, but do not let the lab grow too large.

For the browser client, you do not need a polished UI. A small functional page
is enough. Extend it just enough to demonstrate some of the routes you add.

Examples:

- add a delete button next to each item
- add a simple edit form
- add a detail view for one item

## Optional Extensions

If you finish early, choose one small extension:

- add a second resource such as categories, tags, or projects
- relate two resources with a foreign key
- add filtering or search to one route
- add a second client-side interaction beyond load/create

Graduate students should complete at least one extension and document it in
their starter README.

## Running the Starter

Move into the starter directory:

```bash
cd labs/lab05-api-client-and-db-intg/starter
```

Install dependencies:

```bash
npm install
```

Start Postgres:

```bash
docker compose up -d
```

Run the API:

```bash
npm run api
```

Run the browser client in a second terminal:

```bash
npm run client
```

Open:

```text
http://localhost:5173
```

The API runs on:

```text
http://localhost:3000
```

The starter Postgres container is exposed on host port `5433`, so it is less
likely to conflict with another local Postgres instance already using `5432`.

## What to Notice in the Starter

As you read the starter, pay attention to:

- how the database connection is configured
- where the table creation and seed logic happens
- how the API reads JSON request bodies
- how SQL results are turned into JSON responses
- how the browser client handles success and error states
- how CORS allows the browser app to call the API across ports

## Deliverables

Submit your completed starter directory with:

- your implemented API routes
- your updated client code
- any schema or SQL changes you made
- your reflection answers in the starter `README.md`

## Reflection Prompts

Answer these in `starter/README.md`:

1. What changed when the API moved from in-memory data to Postgres?
2. When should you use `PUT` instead of `PATCH`?
3. What kinds of validation belong in the API even if the browser client also validates input?
4. How does the browser client help you test the API differently than `curl` alone?
5. If you added an extension, what did you add and why?
