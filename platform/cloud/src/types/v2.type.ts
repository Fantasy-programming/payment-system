import { t, type Static } from "elysia"

const interfaceSchema = t.Object({
  typ: t.Union([t.Literal("ethernet"), t.Literal("vlan"), t.Literal("wireless"), t.Literal("lte")]),
  id: t.String({ error: "id must be present" }),
  nam: t.String({ error: "missing name" }),
  mac: t.String({ error: "missing mac address" }),
  spd: t.Optional(t.String({ error: "missing speed" })), // Speed as string (e.g., "1000Mbps")
  mtu: t.Optional(t.String({ error: "missing mtu" })), // MTU as string
  arp: t.Optional(t.String()),
  txb: t.String({ error: "missing tx bytes" }), // TX bytes as string
  rxb: t.String(), // RX bytes as string
  txbps: t.String(), // TX speed in kbps as string
  rxbps: t.String(), // RX speed in kbps as string
  run: t.String(), // Running status as string (e.g., "true")
  cmt: t.Optional(t.String()),
})

export const towerHealth = t.Object({
  sn: t.String(),
  token: t.String(),
  network: t.Array(interfaceSchema),
})

export const towerTasksQuery = t.Object({
  sn: t.String({ error: "missing sn" }),
  token: t.String({ error: "missing token" }),
  identity: t.String({ error: "missing identity" }),
  model: t.String({ error: "missing model" }),
  firmware: t.String({ error: "missing firmware" }),
  uptime: t.String({ error: "missing uptime" }),
  cplo: t.String({ error: "missing cplo" }),
  fm: t.String({ error: "missing fm" }),
  tm: t.String({ error: "missing tm" }),
  fhds: t.String({ error: "missing fhds" }),
  thds: t.String({ error: "missing thds" }),
  op: t.String({ error: "missing op" }),
})

export const wsActionSchema = t.Object({
  type: t.Literal("Action"),
  device: t.String(),
  token: t.String(),
  action: t.Union([t.Literal("users"), t.Literal("active")]),
})

export type WSActionSchema = Static<typeof wsActionSchema>
export type WSSubSchema = Static<typeof wsSubSchema>

export const wsSubSchema = t.Object({
  type: t.Literal("Subscribe"),
  device: t.String(),
  channel: t.Union([t.Literal("health"), t.Literal("user"), t.Literal("logs")]),
})

export const wsPayloadSchema = t.Union([wsActionSchema, wsSubSchema])
