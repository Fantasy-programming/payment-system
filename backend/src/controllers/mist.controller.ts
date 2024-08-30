import { fileURLToPath } from "url";
import path, { dirname } from "path";
import type { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../env";

const __dirname = dirname(fileURLToPath(import.meta.url));

const mistController = (req: Request, res: Response, next: NextFunction) => {
  if (/(.css|.js|.png|.jpg|.jpeg|.svg|.gif|.ico)$/.test(req.path)) {
    return next();
  }

  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");

  if (NODE_ENV === "production") {
    return res.sendFile(path.resolve(__dirname, "..", "static", "index.html"));
  }

  return res.sendFile(
    path.resolve(__dirname, "..", "..", "static", "index.html"),
  );
};

export default mistController;
