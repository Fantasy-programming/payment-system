import logger from "../logger";
import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: Error,
  _: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.error(error);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "SyntaxError") {
    return response.status(400).json({ error: "malformatted request" });
  } else if (error.name === "UnauthorizedError") {
    logger.error(error);
    return response.status(401).json({ error: error.message });
  } else if (error.name === "InternalError") {
    return response.status(500).json({ error: error.message });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  return next(error);
};

export const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
