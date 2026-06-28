import crypto from "node:crypto";

export function addRequestId(req, res, next) {
  req.requestId = crypto.randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
}
