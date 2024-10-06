import net from "net"
import tls from "tls"
import crypto from "crypto"

type TalkReturnType<P extends boolean> = P extends true ? { [key: string]: string }[] : string[]

export class RouterOSApi {
  private timeout: number = 3
  private attempts: number = 5
  private retry: number = 3
  private delay: number = 3
  private socket: net.Socket | tls.TLSSocket | null = null

  constructor(
    private host: string,
    private port: number,
    private secure: boolean = false,
  ) {
    for (let trial = 1; trial <= this.attempts; trial++) {
      if (secure) {
        this.socket = tls.connect({ host, port })
        this.socket.setTimeout(this.timeout * 1000)
      } else {
        this.socket = net.connect({ host, port })
        this.socket.setTimeout(this.timeout * 1000)
      }
    }
  }

  public async login(username: string, password: string): Promise<boolean> {
    const response = await this.talk(["/login", `=name=${username}`, `=password=${password}`], false)

    if (response[0] === "!trap") {
      return false
    } else if (response[0] === "=ret") {
      const chal = Buffer.from(response[1], "hex")
      const hash = crypto.createHash("md5")
      hash.update(Buffer.from([0]))
      hash.update(Buffer.from(password, "utf-8"))
      hash.update(chal)
      const md5Hash = hash.digest("hex")

      const loginResponse = await this.talk(["/login", `=name=${username}`, `=response=00${md5Hash}`], false)

      if (loginResponse[0] === "!trap") {
        return false
      }
    }

    return true
  }

  public async talk<
    O extends Record<string, string> | boolean | undefined,
    P extends boolean = O extends boolean ? O : true,
  >(
    command: string | (string | Record<string, string>)[],
    options?: O,
    parse: P = (typeof options === "boolean" ? options : true) as P,
  ): Promise<TalkReturnType<P>> {
    let words: string[]

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
    } else if (typeof options === "boolean") {
      parse = options as unknown as P
    }

    return new Promise((resolve, reject) => {
      let response: string = ""
      let attempts: number = 0

      const onData = async (data: Buffer) => {
        const sentence = this.readSentence(data)
        const reply = sentence[0]
        if (!parse) {
          console.log(sentence)
          this.socket?.off("data", onData)
          if (reply === "!done") {
            resolve(sentence as TalkReturnType<P>)
            return
          } else {
            reject(`operation failed ${sentence[1]}`)
            return
          }
        }
        if (reply !== "!re") {
          this.socket?.off("data", onData)
          if (attempts < this.retry) {
            attempts++
            this.setDelay(this.delay * 1000)
            attemptWrite()
          } else {
            reject("Failed after multiple attempts")
          }
          return
        }
        for (let i = 1; i < sentence.length; i++) {
          const item = sentence[i]
          if (item === "!done") {
            this.socket?.off("data", onData)
            const data = this.parseResponse(response)
            resolve(data as TalkReturnType<P>)
          }
          response += item + "\n"
        }
      }
      const attemptWrite = () => {
        this.socket?.on("data", onData)
        this.writeSentence(words)
      }
      attemptWrite()
    })
  }

  private setDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  private writeSentence(words: string[]): void {
    words.forEach((word) => this.writeWord(word))
    this.writeWord("")
  }

  private readSentence(data: Buffer): string[] {
    const sentence: string[] = []
    let offset = 0

    while (offset < data.length) {
      const wordLength = this.readLen(data, offset)
      offset += wordLength.byteLength
      const word = data.subarray(offset, offset + wordLength.length).toString("utf-8")
      offset += wordLength.length
      sentence.push(word)
    }

    return sentence
  }

  private parseResponse(data: string): { [key: string]: string }[] {
    const lines = data.split("\n")

    const result: { [key: string]: string }[] = []
    let temp: { [key: string]: string } = {}

    lines.forEach((line) => {
      if (line.startsWith("=")) {
        const [key, value] = line.substring(1).split("=", 2) // substring(1) to remove the first "="
        temp[key] = value || ""
      } else {
        if (!this.isObjEmpty(temp)) {
          result.push(temp)
          temp = {}
        }
      }
    })

    return result
  }

  private isObjEmpty(obj: Object) {
    return Object.keys(obj).length === 0
  }

  private writeWord(word: string): void {
    const lengthBuffer = this.writeLen(word.length)
    this.socket?.write(`${lengthBuffer}${word.trim()}`, "utf-8")
  }

  private readLen(data: Buffer, offset: number): { byteLength: number; length: number } {
    const firstByte = data.readUInt8(offset)

    if (firstByte < 0x80) {
      return { byteLength: 1, length: firstByte }
    } else if ((firstByte & 0xc0) === 0x80) {
      return { byteLength: 2, length: ((firstByte & 0x3f) << 8) + data.readUInt8(offset + 1) }
    } else if ((firstByte & 0xe0) === 0xc0) {
      return {
        byteLength: 3,
        length: ((firstByte & 0x1f) << 16) + (data.readUInt8(offset + 1) << 8) + data.readUInt8(offset + 2),
      }
    } else if ((firstByte & 0xf0) === 0xe0) {
      return {
        byteLength: 4,
        length:
          ((firstByte & 0x0f) << 24) +
          (data.readUInt8(offset + 1) << 16) +
          (data.readUInt8(offset + 2) << 8) +
          data.readUInt8(offset + 3),
      }
    } else {
      const length =
        ((data.readUInt8(offset + 1) << 24) |
          (data.readUInt8(offset + 2) << 16) |
          (data.readUInt8(offset + 3) << 8) |
          data.readUInt8(offset + 4)) >>>
        0
      return { byteLength: 5, length: length }
    }
  }

  private writeLen(length: number): Buffer {
    if (length < 0x80) {
      return Buffer.from([length])
    } else if (length < 0x4000) {
      return Buffer.from([((length >> 8) & 0x3f) | 0x80, length & 0xff])
    } else if (length < 0x200000) {
      return Buffer.from([((length >> 16) & 0x1f) | 0xc0, (length >> 8) & 0xff, length & 0xff])
    } else if (length < 0x10000000) {
      return Buffer.from([((length >> 24) & 0x0f) | 0xe0, (length >> 16) & 0xff, (length >> 8) & 0xff, length & 0xff])
    } else {
      return Buffer.from([0xf0, (length >> 24) & 0xff, (length >> 16) & 0xff, (length >> 8) & 0xff, length & 0xff])
    }
  }

  public close() {
    if (this.socket) {
      this.socket.end() // Gracefully closes the connection
      this.socket = null // Clear the reference to the socket
      console.log("Socket closed.")
    } else {
      console.error("No socket to close.")
    }
  }
}
