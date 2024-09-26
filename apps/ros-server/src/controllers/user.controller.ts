import userService from "../services/user.service"

import type { Request, Response } from "express"

const getUsers = async (_: Request, response: Response) => {
  const data = await userService.getAll()
  return response.json(data)
}

export default {
  getUsers,
}
