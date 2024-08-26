import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { JWT_SECRET } from "../env";

import type { Request, Response, NextFunction } from "express";
import type { IJWT } from "../types/Jwt.type";

export const tokenExtractor = (
  request: Request,
  _: Response,
  next: NextFunction,
) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }

  next();
};

export const userExtractor = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    if (!request.token) {
      return response.status(401).json({ error: "token missing or invalid" });
    }
    const decodedToken = jwt.verify(
      request.token,
      JWT_SECRET as string,
    ) as IJWT;

    if (!decodedToken?.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const res = await User.findById(decodedToken.id);

    if (!res) {
      return response.status(401).json({ error: "user not found" });
    }

    request.user = res;

    return next();
  } catch (error) {
    return next(error);
  }
};
