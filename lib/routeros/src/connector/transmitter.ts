import { Socket } from "net"
import iconv from "iconv-lite"

/**
 * Class responsible for transmitting data over the
 * socket to the routerboard
 */
export class Transmitter {
  /**
   * The socket which connects to the routerboard
   */
  private socket: Socket

  /**
   * Pool of data to be sent after the socket connects
   */
  private pool: Buffer[] = []

  /**
   * Constructor
   *
   * @param socket
   */
  constructor(socket: Socket) {
    this.socket = socket
  }

  /**
   * Write data over the socket, if it not writable yet,
   * save over the pool to be ran after
   *
   * @param {string} data
   */
  public write(data: string | null): void {
    const encodedData = this.encodeString(data)
    if (!this.socket.writable || this.pool.length > 0) {
      this.pool.push(encodedData)
    } else {
      this.socket.write(encodedData)
    }
  }

  /**
   * Writes all data stored in the pool
   */
  public runPool(): void {
    let data: Buffer | undefined
    while (this.pool.length > 0) {
      data = this.pool.shift()
      if (data) {
        this.socket.write(data)
      }
    }
  }

  /**
   * Encode the string data that will
   * be sent over to the routerboard.
   *
   * It's encoded in win1252 so any accentuation on foreign languages
   * are displayed correctly when opened with winbox.
   *
   * Credits for George Joseph: https://github.com/gtjoseph
   * and for Brandon Myers: https://github.com/Trakkasure
   *
   * @param {string} str
   */
  private encodeString(str: string | null): Buffer {
    if (str === null) return Buffer.from([0])

    const encoded = iconv.encode(str, "win1252")

    let data
    let len = encoded.length
    let offset = 0

    if (len < 0x80) {
      data = Buffer.alloc(len + 1)
      data[offset++] = len
    } else if (len < 0x4000) {
      data = Buffer.alloc(len + 2)
      len |= 0x8000
      data[offset++] = (len >> 8) & 0xff
      data[offset++] = len & 0xff
    } else if (len < 0x200000) {
      data = Buffer.alloc(len + 3)
      len |= 0xc00000
      data[offset++] = (len >> 16) & 0xff
      data[offset++] = (len >> 8) & 0xff
      data[offset++] = len & 0xff
    } else if (len < 0x10000000) {
      data = Buffer.alloc(len + 4)
      len |= 0xe0000000
      data[offset++] = (len >> 24) & 0xff
      data[offset++] = (len >> 16) & 0xff
      data[offset++] = (len >> 8) & 0xff
      data[offset++] = len & 0xff
    } else {
      data = Buffer.alloc(len + 5)
      data[offset++] = 0xf0
      data[offset++] = (len >> 24) & 0xff
      data[offset++] = (len >> 16) & 0xff
      data[offset++] = (len >> 8) & 0xff
      data[offset++] = len & 0xff
    }

    data.fill(encoded, offset)
    return data
  }
}
