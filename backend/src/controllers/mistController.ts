import { fileURLToPath } from "url";
import path, { dirname } from "path";

import type { Request, Response } from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));

const mistController = (_req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "..", "static", "index.html"));
};

export default mistController;
