# Example 04 — Middleware

This example shows how Express middleware sits between the incoming HTTP request
and the final route handler.

The example demonstrates:

- request logging
- request IDs
- API key checking
- route-level middleware
- centralized 404 handling
- centralized error handling

## Install

```bash
npm install
```

## Run

```bash
cp .env.example .env
npm run dev
```

The server runs on:

```text
http://localhost:3000
```

## Try it

Health check:

```bash
curl http://localhost:3000/health
```

Public route:

```bash
curl http://localhost:3000/api/items
```

Protected route without API key:

```bash
curl http://localhost:3000/api/admin/status
```

Protected route with API key:

```bash
curl -H "x-api-key: class-demo-key" http://localhost:3000/api/admin/status
```

## Main lesson

Middleware is useful for behavior that should happen around routes rather than
inside every route handler.

Examples include logging, authentication, authorization, validation, error
handling, and request parsing.
