# Lab 3 REST API

## How to Run

```bash
npm install
npm run server
```

The server runs on:

```text
http://localhost:3000
```

## How to Test

```bash
npm test
```

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/items` | Return all items |
| GET | `/items/:id` | Return one item |
| POST | `/items` | Create one item |
| PUT | `/items/:id` | Update one item |
| DELETE | `/items/:id` | Delete one item |

## Reflection Answers

### 1. What makes this API more REST-like than the previous HTTP/JSON lab?

This API is more REST-like because the client directly interacts with server resources using common HTTP methods.

### 2. What is the purpose of a route parameter such as `/items/:id`?

A route parameter allows internal structure to change while having the UX experience remain the same. A symbolic link in this manner also helps maintain code readability for future developers.

### 3. Why should `POST`, `PUT`, and `DELETE` use different HTTP methods?

These different HTTP methods intend to achieve different outcomes. Using distinct method calls further maintains code cleanliness for both the client and developers.

### 4. What is the difference between a `400` error and a `404` error?

A 400 error is specifically when the request body is invalid, while a 404 error is when the structure was correct, but the resource was not found.

### 5. How does the OpenAPI file relate to your Express server code?

The OpenAPI file serves as a guide for the client, keeping responses predictable and easily verifiable if the syntax of a request changes.