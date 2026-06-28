export function requireApiKey(req, res, next) {
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    return next(new Error("Server is missing API_KEY configuration."));
  }

  const actualApiKey = req.header("x-api-key");

  if (actualApiKey !== expectedApiKey) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing or invalid x-api-key header.",
      requestId: req.requestId
    });
  }

  next();
}
