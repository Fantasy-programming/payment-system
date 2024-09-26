import net from "net"
import tls from "tls"
import crypto from "crypto"

type TalkReturnType<P extends boolean> = P extends true ? { [key: string]: string } : string[]

export class RouterOSApi {
  private timeout: number = 3
  private attempts: number = 5
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

  public talk<P extends boolean = true>(words: string[], parse: P = true as P): Promise<TalkReturnType<P>> {
    return new Promise((resolve, reject) => {
      let response: string = ""

      const onData = (data: Buffer) => {
        const sentence = this.readSentence(data)
        const reply = sentence[0]

        if (!parse) {
          this.socket?.off("data", onData)
          resolve(sentence as TalkReturnType<P>)
          return
        }

        if (reply != "!re") {
          this.socket?.off("data", onData)
          console.error(sentence)
          reject("idk what is going on")
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

      this.socket?.on("data", onData)
      this.writeSentence(words)
    })
  }

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

  private parseResponse(data: string): { [key: string]: string } {
    const lines = data.split("\n")
    const result: { [key: string]: string } = {}

    lines.forEach((line) => {
      if (line.startsWith("=")) {
        const [key, value] = line.substring(1).split("=", 2) // substring(1) to remove the first "="
        result[key] = value || ""
      }
    })

    return result
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
      console.log("No socket to close.")
    }
  }
}
