import { Socket } from "net"
import { RosException } from "../RosException"
import iconv from "iconv-lite"

const nullBuffer = Buffer.from([0x00])

export interface ISentence {
  sentence: string
  hadMore: boolean
}

export interface IReadCallback {
  name: string
  callback: (data: string[]) => void
}

export class Receiver {
  private socket: Socket

  private tags: Map<string, IReadCallback> = new Map()

  /**
   * The length of the current data chain received from
   * the socket
   */
  private dataLength: number = 0

  /**
   * A pipe of all responses received from the routerboard
   */
  private sentencePipe: ISentence[] = []

  /**
   * Flag if the sentencePipe is being processed to
   * prevent concurrent sentences breaking the pipe
   */
  private processingSentencePipe: boolean = false

  /**
   * The current line being processed from the data chain
   */
  private currentLine: string = ""

  /**
   * The current reply received for the tag
   */
  private currentReply: string = ""

  /**
   * The current tag which the routerboard responded
   */
  private currentTag: string = ""

  /**
   * The current data chain or packet
   */
  private currentPacket: string[] = []

  /**
   * Used to store a partial segment of the
   * length descriptor if it gets split
   * between tcp transmissions.
   */
  private lengthDescriptorSegment: Buffer | null = null

  /**
   * Receives the socket so we are able to read
   * the data sent to it, separating each tag
   * to the according listener.
   *
   * @param socket
   */
  constructor(socket: Socket) {
    this.socket = socket
  }

  /**
   * Register the tag as a reader so when
   * the routerboard respond to the command
   * related to the tag, we know where to send
   * the data to
   *
   * @param tag
   * @param callback
   */

  public read(tag: string, callback: (packet: string[]) => void): void {
    this.tags.set(tag, {
      name: tag,
      callback: callback,
    })
  }

  /**
   * Stop reading from a tag, removing it
   * from the tag mapping. Usually it is closed
   * after the command has sent !done, since each command
   * opens a new auto-generated tag
   *
   * @param tag - The tag to stop reading from
   */
  public stop(tag: string): void {
    this.tags.delete(tag)
  }

  public processRawData(data: Buffer): void {
    if (this.lengthDescriptorSegment) {
      data = Buffer.concat([this.lengthDescriptorSegment, data])
      this.lengthDescriptorSegment = null
    }

    // Loop through the data we just received
    while (data.length > 0) {
      // If this does not contain the beginning of a packet...
      if (this.dataLength > 0) {
        // If the length of the data we have in our buffer
        // is less than or equal to that reported by the
        // bytes used to dermine length...
        if (data.length <= this.dataLength) {
          // Subtract the data we are taking from the length we desire
          this.dataLength -= data.length

          // Add this data to our current line
          this.currentLine += iconv.decode(data, "win1252")

          // If there is no more desired data we want...
          if (this.dataLength === 0) {
            // Push the data to the sentance
            this.sentencePipe.push({
              sentence: this.currentLine,
              hadMore: data.length !== this.dataLength,
            })

            // process the sentance and clear the line
            this.processSentence()
            this.currentLine = ""
          }

          // Break out of processRawData and wait for the next
          // set of data from the socket
          break

          // If we have more data than we desire...
        } else {
          // slice off the part that we desire
          const tmpBuffer = data.subarray(0, this.dataLength)

          // decode this segment
          const tmpStr = iconv.decode(tmpBuffer, "win1252")

          // Add this to our current line
          this.currentLine += tmpStr

          // save our line...
          const line = this.currentLine

          // clear the current line
          this.currentLine = ""

          // cut off the line we just pulled out
          data = data.subarray(this.dataLength)

          // determine the length of the next word. This method also
          // returns the number of bytes it took to describe the length
          const [descriptor_length, length] = this.decodeLength(data)

          // If we do not have enough data to determine
          // the length... we wait for the next loop
          // and store the length descriptor segment
          if (descriptor_length > data.length) {
            this.lengthDescriptorSegment = data
          }

          // Save this as our next desired length
          this.dataLength = length

          // slice off the bytes used to describe the length
          data = data.subarray(descriptor_length)

          // If we only desire one more and its the end of the sentance...
          if (this.dataLength === 1 && data.equals(nullBuffer)) {
            this.dataLength = 0
            data = data.subarray(1) // get rid of excess buffer
          }
          this.sentencePipe.push({
            sentence: line,
            hadMore: data.length > 0,
          })
          this.processSentence()
        }

        // This is the beginning of this packet...
        // This ALWAYS gets run first
      } else {
        // returns back the start index of the data and the length
        const [descriptor_length, length] = this.decodeLength(data)

        // store how long our data is
        this.dataLength = length

        // slice off the bytes used to describe the length
        data = data.subarray(descriptor_length)

        if (this.dataLength === 1 && data.equals(nullBuffer)) {
          this.dataLength = 0
          data = data.subarray(1) // get rid of excess buffer
        }
      }
    }
  }

  /**
   * Process each sentence from the data packet received.
   *
   * Detects the .tag of the packet, sending the data to the
   * related tag when another reply is detected or if
   * the packet had no more lines to be processed.
   *
   */
  private processSentence(): void {
    if (!this.processingSentencePipe) {
      this.processingSentencePipe = true

      const process = () => {
        if (this.sentencePipe.length > 0) {
          const line = this.sentencePipe.shift()

          if (!line) return

          if (!line.hadMore && this.currentReply === "!fatal") {
            this.socket.emit("fatal")
            return
          }

          if (/^\.tag=/.test(line.sentence)) {
            this.currentTag = line.sentence.substring(5)
          } else if (/^!/.test(line.sentence)) {
            if (this.currentTag) {
              this.sendTagData(this.currentTag)
            }
            this.currentPacket.push(line.sentence)
            this.currentReply = line.sentence
          } else {
            this.currentPacket.push(line.sentence)
          }

          if (this.sentencePipe.length === 0 && this.dataLength === 0) {
            if (!line.hadMore && this.currentTag) {
              this.sendTagData(this.currentTag)
            }
            this.processingSentencePipe = false
          } else {
            process()
          }
        } else {
          this.processingSentencePipe = false
        }
      }

      process()
    }
  }

  /**
   * Send the data collected from the tag to the
   * tag reader
   */
  private sendTagData(currentTag: string): void {
    const tag = this.tags.get(currentTag)
    if (tag) {
      tag.callback(this.currentPacket)
    } else {
      throw new RosException("UNREGISTEREDTAG")
    }
    this.cleanUp()
  }

  /**
   * Clean the current packet, tag and reply state
   * to start over
   */
  private cleanUp(): void {
    this.currentPacket = []
    this.currentTag = ""
    this.currentReply = ""
  }

  /**
   * Decodes the length of the buffer received
   *
   * Credits for George Joseph: https://github.com/gtjoseph
   * and for Brandon Myers: https://github.com/Trakkasure
   *
   * @param {Buffer} data
   */
  private decodeLength(data: Buffer): number[] {
    let len
    let idx = 0
    const b = data[idx++]

    if (b & 128) {
      if ((b & 192) === 128) {
        len = ((b & 63) << 8) + data[idx++]
      } else {
        if ((b & 224) === 192) {
          len = ((b & 31) << 8) + data[idx++]
          len = (len << 8) + data[idx++]
        } else {
          if ((b & 240) === 224) {
            len = ((b & 15) << 8) + data[idx++]
            len = (len << 8) + data[idx++]
            len = (len << 8) + data[idx++]
          } else {
            len = data[idx++]
            len = (len << 8) + data[idx++]
            len = (len << 8) + data[idx++]
            len = (len << 8) + data[idx++]
          }
        }
      }
    } else {
      len = b
    }

    return [idx, len]
  }
}
