import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import env from "../env";

import type { Request, Response, NextFunction } from "express";
import type { IJWT } from "../types/jwt.type";
import type { IUser } from "../types/user.type";

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
    const decodedToken = jwt.verify(request.token, env.JWT_SECRET) as IJWT;

    if (!decodedToken?.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    let user: IUser | null = null;
    const redis = request.app.locals.cache;
    const key = `cache:user:${decodedToken.id}:me`;
    const cachedUser = await redis.get(key);

    if (cachedUser) {
      user = JSON.parse(cachedUser);
      // @ts-expect-error: change id into _id
      user._id = user.id;
    } else {
      user = await User.findById(decodedToken.id);
      redis.setex(key, 24 * 60 * 60, JSON.stringify(user));
      redis.sadd(`tag:users`, key);
    }

    if (!user) {
      return response.status(401).json({ error: "user not found" });
    }

    request.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};
