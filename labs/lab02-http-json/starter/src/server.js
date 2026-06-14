import http from "node:http";

const DEFAULT_PORT = 3000;

let requestCount = 0;

export function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(body));
}

export function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            if (body.trim() === "") {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", reject);
    });
}

export function handleCalculate(body) {
    const { operation, a, b } = body;

    if (operation === undefined || a === undefined || b === undefined) {
        return {
            statusCode: 400,
            response: {
                error: "Missing required fields"
            }
        };
    }

    if (typeof operation !== "string") {
        return {
            statusCode: 400,
            response: {
                error: "Operation must be a string"
            }
        };
    }

    if (typeof a !== "number" || typeof b !== "number" || !Number.isFinite(a) || !Number.isFinite(b)) {
        return {
            statusCode: 400,
            response: {
                error: "a and b must be numbers"
            }
        };
    }

    switch (operation) {
        case "add":
            return {
                statusCode: 200,
                response: {
                    result: a + b
                }
            };

        case "subtract":
            return {
                statusCode: 200,
                response: {
                    result: a - b
                }
            };

        case "multiply":
            return {
                statusCode: 200,
                response: {
                    result: a * b
                }
            };

        case "divide":
            if (b === 0) {
                return {
                    statusCode: 400,
                    response: {
                        error: "Division by zero"
                    }
                };
            }

            return {
                statusCode: 200,
                response: {
                    result: a / b
                }
            };

        default:
            return {
                statusCode: 400,
                response: {
                    error: "Unsupported operation"
                }
            };
    }
}

function methodNotAllowed(res) {
    sendJson(res, 405, { error: "Method not allowed" });
}

export async function requestHandler(req, res) {
    requestCount += 1;

    const method = req.method;
    const pathname = new URL(req.url, "http://localhost").pathname;

    if (pathname === "/health") {
        if (method !== "GET") {
            methodNotAllowed(res);
            return;
        }

        sendJson(res, 200, { status: "ok" });
        return;
    }

    if (pathname === "/requests") {
        if (method !== "GET") {
            methodNotAllowed(res);
            return;
        }

        sendJson(res, 200, { count: requestCount });
        return;
    }

    if (pathname === "/echo") {
        if (method !== "POST") {
            methodNotAllowed(res);
            return;
        }

        try {
            const body = await readJsonBody(req);
            sendJson(res, 200, body);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    if (pathname === "/calculate") {
        if (method !== "POST") {
            methodNotAllowed(res);
            return;
        }

        try {
            const body = await readJsonBody(req);
            const result = handleCalculate(body);

            sendJson(res, result.statusCode, result.response);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    sendJson(res, 404, { error: "Not found" });
}

export function createServer() {
    return http.createServer(requestHandler);
}

export function resetState() {
    requestCount = 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const port = process.env.PORT || DEFAULT_PORT;
    const server = createServer();

    server.listen(port, () => {
        console.log(`HTTP JSON server listening on port ${port}`);
    });
}