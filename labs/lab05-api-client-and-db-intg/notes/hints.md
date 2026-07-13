# Lab 5 Hints

- Start by reading `src/server.js` from top to bottom before changing routes.
- Test each route with `curl` before wiring it into the browser client.
- `PUT` usually expects a full replacement payload. `PATCH` usually updates only the provided fields.
- Use parameterized SQL queries with `$1`, `$2`, and so on.
- Check for missing rows after `SELECT`, `UPDATE`, or `DELETE` so you can return `404`.
- Keep the first version of your schema simple.
