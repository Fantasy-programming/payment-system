import type { Request, Response, NextFunction } from "express";

export const requestCounter = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const metrics = request.app.locals.metrics;

  metrics.requestCounter
    .labels(request.method, request.path, response.statusCode.toString())
    .inc();

  next();
};
