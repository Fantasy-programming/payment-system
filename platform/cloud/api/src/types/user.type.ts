import { t } from "elysia"
import type { Static } from "@sinclair/typebox"

export const userSchema = t.Object({
  id: t.String(),
  name: t.String(),
  password: t.String(),
  profile: t.String(),
  uptime: t.String(),
  "bytes-in": t.Number(),
  "bytes-out": t.Number(),
  "packets-in": t.Number(),
  "packets-out": t.Number(),
  dynamic: t.Boolean(),
  disabled: t.Boolean(),
  comment: t.Optional(t.String()), // Keep the comment field as a string
  startDate: t.Optional(t.String({ format: "date-time" })), // Optional as not all users will have these
  endDate: t.Optional(t.String({ format: "date-time" })), // Optional as not all users will have these
})

export const usersArraySchema = t.Array(userSchema, {
  description: "An array of all the users registered on the system",
})

export type User = Static<typeof userSchema>
export type UsersArray = Static<typeof usersArraySchema>

export const activeUserSchema = t.Object({
  id: t.String(),
  server: t.String(),
  user: t.String(),
  address: t.String(),
  "mac-address": t.String(),
  "login-by": t.String(),
  uptime: t.String(),
  "idle-time": t.String(),
  "keepalive-timeout": t.String(),
  "bytes-in": t.Number(),
  "bytes-out": t.Number(),
  "packets-in": t.Number(),
  "packets-out": t.Number(),
  "limit-bytes-total": t.Optional(t.Number()), // Optional since not all users have this
  radius: t.Boolean(),
  comment: t.Optional(t.String()), // Keeping comment as optional
  startDate: t.Optional(t.String({ format: "date-time" })), // Optional start date
  endDate: t.Optional(t.String({ format: "date-time" })), // Optional end date
})

export const activeusersArraySchema = t.Array(activeUserSchema, {
  description: "An array of all the users connected on the system (now)",
})

export type ActiveUser = Static<typeof activeUserSchema>
export type ActiveUsersArray = Static<typeof activeusersArraySchema>

export const newUserSchema = t.Object({
  name: t.String(),
  password: t.String(),
  server: t.String(),
  profile: t.String(),
})
