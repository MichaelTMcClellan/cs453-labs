export function notFound(req, res) {
  res.status(404).json({
    error: "Not Found",
    message: `No route matched ${req.method} ${req.originalUrl}`,
    requestId: req.requestId
  });
}
