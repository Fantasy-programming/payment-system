import { type ZodTypeAny, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

/**
 * Middleware  that validates incoming request data against a provided Zod schema.
 * @param {T} schema - The Zod schema to validate the request data against.
 * @returns  An Express middleware function.
 */

export function validateData<T extends ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors[0]?.message;
        res.status(400).json({ error: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}

/**
 * Middleware  that validates incoming request params against a provided Zod schema.
 * @param {T} schema - The Zod schema to validate the params data against.
 * @returns  An Express middleware function.
 */

export function validateParams<T extends ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors[0]?.message;
        res.status(400).json({ error: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
