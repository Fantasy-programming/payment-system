import type { Request, Response } from "express";

const reveal = async (request: Request, response: Response) => {
  const register = request.app.locals.metrics.register;
  const metrics = await register.metrics();

  response.setHeader("Content-Type", register.contentType);
  response.send(metrics);
};

export default { reveal };
