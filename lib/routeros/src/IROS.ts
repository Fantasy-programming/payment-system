import type { ConnectionOptions } from "tls"

/**
 * Crendential options needed for instantiating
 * a RouterOSAPI object
 */
export interface IRosOptions {
  host: string
  user?: string
  password?: string
  port?: number
  timeout?: number
  tls?: ConnectionOptions
  keepalive?: boolean
}

export type IConnectorOptions = {
  host: string
  port?: number
  timeout?: number
  tls?: ConnectionOptions | boolean
}

export interface IRosGenericResponse {
  [propName: string]: unknown
}
