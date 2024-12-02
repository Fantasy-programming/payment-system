import crypto from "crypto"
import { EventEmitter } from "events"
import { Connector } from "./connector/connector"
import { Channel } from "./channel"
import { RStream } from "./RStream"
import { RosException } from "./RosException"

import type { IRosGenericResponse, IRosOptions } from "./IROS"
import type { ConnectionOptions } from "tls"

type CommandInput = string | (string | Record<string, string>)[]

/**
 * Creates a connection object with the credentials provided
 */

export class RouterOSApi extends EventEmitter {
  /**
   * Host to connect
   */
  public host!: string

  /**
   * Username to use
   */
  public user!: string

  /**
   * Password of the username
   */
  public password!: string

  /**
   * Port of the API
   */
  public port!: number

  /**
   * Timeout of the connection
   */
  public timeout!: number

  /**
   * TLS Options to use, if any
   */
  public tls: ConnectionOptions = {}

  /**
   * Connected flag
   */
  public connected: boolean = false

  /**
   * Connecting flag
   */
  public connecting: boolean = false

  /**
   * Closing flag
   */
  public closing: boolean = false

  /**
   * Keep connection alive
   */
  public keepalive!: boolean

  /**
   * The connector which will be used
   */
  private connector: Connector | null = null

  /**
   * The function timeout that will keep the connection alive
   */
  private keptaliveby: NodeJS.Timer | null = null

  /**
   * Counter for channels open
   */
  private channelsOpen: number = 0

  /**
   * Flag if the connection was held by the keepalive parameter
   * or keepaliveBy function
   */
  private holdingConnectionWithKeepalive: boolean = false

  /**
   * Store the timeout when holding the connection
   * when waiting for a channel response
   */
  private connectionHoldInterval: NodeJS.Timer | null = null

  private registeredStreams: RStream[] = []

  // private attempts: number = 5
  // private retry: number = 3
  // private delay: number = 3

  /**
   * Constructor, also sets the language of the thrown errors
   *
   * @param options connection options
   */

  constructor(options: IRosOptions) {
    super()
    this.setOptions(options)
  }

  /**
   * Set connection options, affects before connecting
   *
   * @param options connection options
   */
  public setOptions(options: IRosOptions): void {
    this.host = options.host
    this.user = options.user ?? "admin"
    this.password = options.password ?? ""
    this.port = options.port ?? 8728
    this.timeout = options.timeout ?? 10
    this.tls = options.tls ?? {}
    this.keepalive = options.keepalive || false
  }

  // for (let trial = 1; trial <= this.attempts; trial++) {
  //   if (secure) {
  //     this.socket = tls.connect({ host, port })
  //     this.socket.setTimeout(this.timeout * 1000)
  //   } else {
  //     this.socket = net.connect({ host, port })
  //     this.socket.setTimeout(this.timeout * 1000)
  //   }
  // }

  public async connect(): Promise<RouterOSApi> {
    if (this.connecting) return Promise.reject("ALRDYCONNECTING")
    if (this.connected) return Promise.resolve(this)

    this.connecting = true
    this.connected = false

    this.connector = new Connector({
      host: this.host,
      port: this.port,
      timeout: this.timeout,
      tls: this.tls,
    })

    return new Promise((resolve, reject) => {
      const endListener = (e?: Error) => {
        this.stopAllStreams()
        this.connected = false
        this.connecting = false
        if (e) reject(e)
      }

      if (this.connector === null) {
        return reject(new RosException("ERINTERNAL"))
      }

      this.connector.once("error", endListener)
      this.connector.once("timeout", endListener)
      this.connector.once("close", () => {
        this.emit("close")
        endListener()
      })

      this.connector.once("connected", async () => {
        this.login()
          .then(() => {
            this.connecting = false
            this.connected = true

            this.connector?.removeListener("error", endListener)
            this.connector?.removeListener("timeout", endListener)

            const connectedErrorListener = (e: Error) => {
              this.connected = false
              this.connecting = false
              this.emit("error", e)
            }

            this.connector?.once("error", connectedErrorListener)
            this.connector?.once("timeout", connectedErrorListener)

            if (this.keepalive) this.keepaliveBy("#")

            resolve(this)
          })
          .catch((e: RosException) => {
            this.connecting = false
            this.connected = false
            reject(e)
          })
      })

      this.connector?.connect()
    })
  }

  /**
   * Writes a command over the socket to the routerboard
   * on a new channel
   *
   * @param command
   * @param options
   * @returns {Promise}
   */

  public async talk(command: CommandInput, options?: Record<string, string>): Promise<IRosGenericResponse[]> {
    const words = this.cleanCommand(command, options)
    let chann: Channel | null = this.openChannel()
    this.holdConnection()

    chann.once("close", () => {
      chann = null
      this.decreaseChannelsOpen()
      this.releaseConnectionHold()
    })

    return chann.write(words)
  }

  /**
   * Writes a command over the socket to the routerboard
   * on a new channel and return an event of what happens
   * with the responses. Listen for 'data', 'done', 'trap' and 'close'
   * events.
   *
   * @param command
   * @param options
   * @returns The stream object
   */
  public talkStream(command: CommandInput, options?: Record<string, string>): RStream {
    const words = this.cleanCommand(command, options)
    const stream = new RStream(this.openChannel(), words)

    stream.on("started", () => {
      this.holdConnection()
    })

    stream.on("stopped", () => {
      this.unregisterStream(stream)
      this.decreaseChannelsOpen()
      this.releaseConnectionHold()
    })

    stream.start()

    this.registerStream(stream)

    return stream
  }

  /**
   * Returns a stream object for handling continuous data
   * flow.
   *
   * @param params
   * @param callback
   * @returns
   */
  public stream(params: string | string[] = [], ...moreParams: any[]): RStream {
    let callback = moreParams.pop()
    if (typeof callback !== "function") {
      if (callback) moreParams.push(callback)
      callback = null
    }
    params = this.cleanCommand(params, moreParams)
    const stream = new RStream(this.openChannel(), params, callback)

    stream.on("started", () => {
      this.holdConnection()
    })

    stream.on("stopped", () => {
      this.unregisterStream(stream)
      this.decreaseChannelsOpen()
      this.releaseConnectionHold()
      stream.removeAllListeners()
    })

    stream.start()
    stream.prepareDebounceEmptyData()

    this.registerStream(stream)

    return stream
  }

  /**
   * Keep the connection alive by running a set of
   * commands provided instead of the random command
   *
   * @param {string|Array} params
   * @param {function} callback
   */
  public keepaliveBy(params: string | string[] = [], ...moreParams: any[]): void {
    this.holdingConnectionWithKeepalive = true

    if (this.keptaliveby) clearTimeout(this.keptaliveby)

    let callback = moreParams.pop()
    if (typeof callback !== "function") {
      if (callback) moreParams.push(callback)
      callback = null
    }
    params = this.cleanCommand(params)

    const exec = () => {
      if (!this.closing) {
        if (this.keptaliveby) clearTimeout(this.keptaliveby)
        this.keptaliveby = setTimeout(
          () => {
            this.talk(params.slice())
              .then((data) => {
                if (typeof callback === "function") callback(null, data)
                exec()
              })
              .catch((err: Error) => {
                if (typeof callback === "function") callback(err, null)
                exec()
              })
          },
          (this.timeout * 1000) / 2,
        )
      }
    }
    exec()
  }

  // private setDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // private writeSentence(words: string[]): void {
  //   words.forEach((word) => this.writeWord(word))
  //   this.writeWord("")
  // }

  // private readSentence(data: Buffer): string[] {
  //   const sentence: string[] = []
  //   let offset = 0
  //
  //   while (offset < data.length) {
  //     const wordLength = this.readLen(data, offset)
  //     offset += wordLength.byteLength
  //     const word = data.subarray(offset, offset + wordLength.length).toString("utf-8")
  //     offset += wordLength.length
  //     sentence.push(word)
  //   }
  //
  //   return sentence
  // }

  // private parseResponse(data: string): { [key: string]: string }[] {
  //   const lines = data.split("\n")
  //
  //   const result: { [key: string]: string }[] = []
  //   let temp: { [key: string]: string } = {}
  //
  //   lines.forEach((line) => {
  //     if (line.startsWith("=")) {
  //       const [key, value] = line.substring(1).split("=", 2) // substring(1) to remove the first "="
  //       temp[key] = value || ""
  //     } else {
  //       if (!this.isObjEmpty(temp)) {
  //         result.push(temp)
  //         temp = {}
  //       }
  //     }
  //   })
  //
  //   return result
  // }

  /**
   * Login on the routerboard to provide
   * api functionalities, using the credentials
   * provided.
   *
   */

  private async login() {
    this.connecting = true
    const response = await this.talk(["/login", `=name=${this.user}`, `=password=${this.password}`])

    if (response.length === 0) {
      return Promise.resolve(this)
    } else if (response.length === 1) {
      const challenge = Buffer.alloc(this.password.length + 17)
      const challengeOffset = this.password.length + 1

      // Here we have 32 chars with hex encoded 16 bytes of challenge data
      const ret = (response[0] as Record<string, string>).ret
      challenge.write(String.fromCharCode(0) + this.password)

      // To write 32 hec chars to buffer as bytes we need to write 16 bytes
      challenge.write(ret, challengeOffset, ret.length / 2, "hex")
      const resp = "00" + crypto.createHash("MD5").update(challenge).digest("hex")

      try {
        await this.talk(["/login", `=name=${this.user}`, `=response=${resp}`])
        return Promise.resolve(this)
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === "cannot log in" || err.message === "invalid user name or password (6)") {
            err = new RosException("CANTLOGIN")
          }
          this.connector?.destroy()
          return Promise.reject(err)
        }
      }
    }

    Promise.reject(new RosException("CANTLOGIN"))
  }

  // private writeWord(word: string): void {
  //   const lengthBuffer = this.writeLen(word.length)
  //   this.socket?.write(`${lengthBuffer}${word.trim()}`, "utf-8")
  // }

  // private readLen(data: Buffer, offset: number): { byteLength: number; length: number } {
  //   const firstByte = data.readUInt8(offset)
  //
  //   if (firstByte < 0x80) {
  //     return { byteLength: 1, length: firstByte }
  //   } else if ((firstByte & 0xc0) === 0x80) {
  //     return { byteLength: 2, length: ((firstByte & 0x3f) << 8) + data.readUInt8(offset + 1) }
  //   } else if ((firstByte & 0xe0) === 0xc0) {
  //     return {
  //       byteLength: 3,
  //       length: ((firstByte & 0x1f) << 16) + (data.readUInt8(offset + 1) << 8) + data.readUInt8(offset + 2),
  //     }
  //   } else if ((firstByte & 0xf0) === 0xe0) {
  //     return {
  //       byteLength: 4,
  //       length:
  //         ((firstByte & 0x0f) << 24) +
  //         (data.readUInt8(offset + 1) << 16) +
  //         (data.readUInt8(offset + 2) << 8) +
  //         data.readUInt8(offset + 3),
  //     }
  //   } else {
  //     const length =
  //       ((data.readUInt8(offset + 1) << 24) |
  //         (data.readUInt8(offset + 2) << 16) |
  //         (data.readUInt8(offset + 3) << 8) |
  //         data.readUInt8(offset + 4)) >>>
  //       0
  //     return { byteLength: 5, length: length }
  //   }
  // }
  //
  // private writeLen(length: number): Buffer {
  //   if (length < 0x80) {
  //     return Buffer.from([length])
  //   } else if (length < 0x4000) {
  //     return Buffer.from([((length >> 8) & 0x3f) | 0x80, length & 0xff])
  //   } else if (length < 0x200000) {
  //     return Buffer.from([((length >> 16) & 0x1f) | 0xc0, (length >> 8) & 0xff, length & 0xff])
  //   } else if (length < 0x10000000) {
  //     return Buffer.from([((length >> 24) & 0x0f) | 0xe0, (length >> 16) & 0xff, (length >> 8) & 0xff, length & 0xff])
  //   } else {
  //     return Buffer.from([0xf0, (length >> 24) & 0xff, (length >> 16) & 0xff, (length >> 8) & 0xff, length & 0xff])
  //   }
  // }

  private cleanCommand(command: CommandInput, options?: Record<string, string> | boolean): string[] {
    let words: string[] = []
    if (typeof command === "string") {
      words = [command]
    } else if (Array.isArray(command)) {
      words = command
        .map((item) =>
          typeof item === "string" ? item : Object.entries(item).map(([key, value]) => `=${key}=${value}`),
        )
        .flat()
    } else {
      throw new Error("Invalid command format")
    }

    if (typeof options === "object") {
      words.push(...Object.entries(options).map(([key, value]) => `=${key}=${value}`))
    }

    return words
  }

  /**
   * Opens a new channel either for just writing or streaming
   *
   * @returns {Channel}
   */
  private openChannel(): Channel {
    this.increaseChannelsOpen()
    return new Channel(this.connector)
  }

  private increaseChannelsOpen() {
    this.channelsOpen++
  }

  private decreaseChannelsOpen() {
    this.channelsOpen--
  }

  private registerStream(stream: RStream) {
    this.registeredStreams.push(stream)
  }

  private unregisterStream(stream: RStream) {
    this.registeredStreams = this.registeredStreams.filter((registeredStreams) => registeredStreams !== stream)
  }

  private stopAllStreams() {
    for (const registeredStream of this.registeredStreams) {
      registeredStream.stop()
    }
  }

  /**
   * Holds the connection if keepalive wasn't set
   * so when a channel opens, ensure that we
   * receive a response before a timeout
   */
  private holdConnection() {
    // If it's not the first connection to open
    // don't try to hold it again
    if (this.channelsOpen !== 1) return

    if (this.connected && !this.holdingConnectionWithKeepalive) {
      if (this.connectionHoldInterval) clearTimeout(this.connectionHoldInterval)
      const holdConnInterval = () => {
        this.connectionHoldInterval = setTimeout(
          () => {
            if (!this.connector) return

            let chann: Channel | null = new Channel(this.connector)
            chann.on("close", () => {
              chann = null
            })
            chann
              .write(["#"])
              .then(() => {
                holdConnInterval()
              })
              .catch(() => {
                holdConnInterval()
              })
          },
          (this.timeout * 1000) / 2,
        )
      }
      holdConnInterval()
    }
  }

  /**
   * Release the connection that was held
   * when waiting for responses from channels open
   */
  private releaseConnectionHold() {
    // If there are channels still open
    // don't release the hold
    if (this.channelsOpen > 0) return

    if (this.connectionHoldInterval) clearTimeout(this.connectionHoldInterval)
  }

  public close() {
    if (this.closing) {
      return Promise.reject(new RosException("ALRDYCLOSNG"))
    }

    if (!this.connected) {
      return Promise.resolve(this)
    }

    if (this.connectionHoldInterval) {
      clearTimeout(this.connectionHoldInterval)
    }

    if (this.keptaliveby) {
      clearTimeout(this.keptaliveby)
    }

    this.stopAllStreams()

    return new Promise((resolve) => {
      this.closing = true
      this.connector?.once("close", () => {
        this.connector?.destroy()
        this.connector = null
        this.closing = false
        this.connected = false
        resolve(this)
      })
      this.connector?.close()
    })
  }
}
