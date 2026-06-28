import http from "node:http";

const PORT = process.env.PORT || 3000;

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data) + "\n");
}

function readRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            resolve(body);
        });

        req.on("error", error => {
            reject(error);
        });
    });
}

async function handleRequest(req, res) {
    console.log(`${req.method} ${req.url}`);

    if (req.method === "GET" && req.url === "/health") {
        sendJson(res, 200, {
            status: "ok"
        });
        return;
    }

    if (req.method === "GET" && req.url === "/hello") {
        sendJson(res, 200, {
            message: "Hello from the HTTP JSON server"
        });
        return;
    }

    if (req.method === "POST" && req.url === "/echo") {
        const rawBody = await readRequestBody(req);

        try {
            const parsedBody = JSON.parse(rawBody);

            sendJson(res, 200, {
                youSent: parsedBody
            });
        } catch {
            sendJson(res, 400, {
                error: "Invalid JSON"
            });
        }

        return;
    }

    sendJson(res, 404, {
        error: "Not found"
    });
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`HTTP JSON example server listening on port ${PORT}`);
});