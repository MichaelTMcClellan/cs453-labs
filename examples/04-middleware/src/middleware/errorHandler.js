export function errorHandler(err, req, res, next) {
  console.error(`${req.requestId} ERROR`, err);

  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong on the server.",
    requestId: req.requestId
  });
}
