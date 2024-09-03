import net from 'net';
import crypto from 'crypto';
import { EventEmitter } from 'events';

interface RouterOSResponse {
  [key: string]: string;
}

class RouterOSAPI extends EventEmitter {
  private socket: net.Socket | null = null;
  private buffer: Buffer = Buffer.alloc(0);
  private debug: boolean = false;
  private connected: boolean = false;
  private ssl: boolean = false;
  private timeout: number = 3000;
  private attempts: number = 5;
  private delay: number = 3000;

  constructor(private port: number = 8728) {
    super();
  }

  setDebug(debug: boolean): void {
    this.debug = debug;
  }

  private debugLog(message: string): void {
    if (this.debug) {
      console.log(message);
    }
  }

  async connect(ip: string, username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempt = 0;
      const tryConnect = () => {
        attempt++;
        this.debugLog(`Connection attempt #${attempt} to ${ip}:${this.port}...`);

        this.socket = new net.Socket();

        this.socket.connect(this.port, ip, async () => {
          this.debugLog('Connected...');
          this.connected = true;
          try {
            await this.login(username, password);
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        this.socket.on('error', (error) => {
          this.debugLog(`Error: ${error.message}`);
          if (attempt < this.attempts) {
            setTimeout(tryConnect, this.delay);
          } else {
            reject(error);
          }
        });

        this.socket.on('close', () => {
          this.debugLog('Disconnected...');
          this.connected = false;
          this.emit('close');
        });
      };

      tryConnect();
    });
  }

  private async login(username: string, password: string): Promise<void> {
    const loginCommand = ['/login', `=name=${username}`, `=password=${password}`];
    const response = await this.write(loginCommand);

    for (const [reply, attrs] of response) {
      if (reply === '!trap') {
        throw new Error('Login failed');
      } else if (reply === '!done') {
        return;
      } else if

        (attrs['=ret']) {
        const challenge = Buffer.from(attrs['=ret'], 'hex');
        const md = crypto.createHash('md5');
        md.update(Buffer.from([0]));
        md.update(password);
        md.update(challenge);

        const loginResponse = [
          '/login',
          `=name=${username}`,
          `=response=00${md.digest('hex')}`,
        ];
        const finalResponse = await this.write(loginResponse);

        for (const [finalReply] of finalResponse) {
          if (finalReply === '!trap') {
            throw new Error('Login failed');
          }
          if (finalReply === '!done') {
            return; // Login successful
          }
        }
      }
    }
    throw new Error('Unexpected login response');
  }

  async write(words: string[]): Promise<[string, RouterOSResponse][]> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.connected) {
        reject(new Error('Not connected'));
        return;
      }

      const responses: [string, RouterOSResponse][] = [];
      let currentSentence: string[] = [];

      const dataHandler = (data: Buffer) => {
        this.buffer = Buffer.concat([this.buffer, data]);

        // Process the entire buffer and keep accumulating until we reach the end
        while (this.buffer.length > 0) {
          const { word, remaining } = this.decodeWord(this.buffer);
          if (word === null) break; // Break if we don't have a complete word yet

          this.buffer = remaining;

          if (word === '') {
            if (currentSentence.length > 0) {
              const [reply, ...rest] = currentSentence;
              const attrs: RouterOSResponse = {};
              for (const w of rest) {
                const [key, value] = w.split('=');
                attrs[key] = value || '';
              }
              responses.push([reply, attrs]);

              if (reply === '!done') {
                this.socket?.removeAllListeners('data');
                resolve(responses);
                return;
              }
              currentSentence = [];
            }
          } else {
            currentSentence.push(word);
          }
        }
      };

      this.socket.on('data', dataHandler);

      this.writeSentence(words);
    });
  }

  private processBuffer(
    currentSentence: string[],
    responses: [string, RouterOSResponse][],
    resolve: (value: [string, RouterOSResponse][]) => void
  ): void {
    while (this.buffer.length > 0) {
      const { word, remaining } = this.decodeWord(this.buffer);
      if (word === null) break;
      this.buffer = remaining;

      if (word === '') {
        if (currentSentence.length > 0) {
          const [reply, ...rest] = currentSentence;
          const attrs: RouterOSResponse = {};
          for (const w of rest) {
            const [key, value] = w.split('=');
            attrs[key] = value || '';
          }
          responses.push([reply, attrs]);
          if (reply === '!done') {
            this.socket?.removeAllListeners('data');
            resolve(responses);
            return;
          }
          currentSentence = [];
        }
      } else {
        currentSentence.push(word);
      }
    }
  }

  private writeSentence(words: string[]): void {
    for (const word of words) {
      this.writeWord(word);
    }
    this.writeWord('');
  }

  private writeWord(word: string): void {
    const length = this.encodeLength(word.length);
    this.socket?.write(Buffer.concat([length, Buffer.from(word)]));
  }

  private encodeLength(length: number): Buffer {
    if (length < 0x80) {
      return Buffer.from([length]);
    } else if (length < 0x4000) {
      return Buffer.from([(length >> 8) | 0x80, length & 0xff]);
    } else if (length < 0x200000) {
      return Buffer.from([(length >> 16) | 0xc0, (length >> 8) & 0xff, length & 0xff]);
    } else if (length < 0x10000000) {
      return Buffer.from([
        (length >> 24) | 0xe0,
        (length >> 16) & 0xff,
        (length >> 8) & 0xff,
        length & 0xff,
      ]);
    } else {
      return Buffer.from([
        0xf0,
        (length >> 24) & 0xff,
        (length >> 16) & 0xff,
        (length >> 8) & 0xff,
        length & 0xff,
      ]);
    }
  }

  private decodeWord(buffer: Buffer): { word: string | null; remaining: Buffer } {
    let length = buffer[0];
    let lengthBytes = 1;

    if ((length & 0x80) === 0x00) {
      // length is fine
    } else if ((length & 0xc0) === 0x80) {
      if (buffer.length < 2) return { word: null, remaining: buffer };
      length = ((length & 0x3f) << 8) | buffer[1];
      lengthBytes = 2;
    } else if ((length & 0xe0) === 0xc0) {
      if (buffer.length < 3) return { word: null, remaining: buffer };
      length = ((length & 0x1f) << 16) | (buffer[1] << 8) | buffer[2];
      lengthBytes = 3;
    } else if ((length & 0xf0) === 0xe0) {
      if (buffer.length < 4) return { word: null, remaining: buffer };
      length = ((length & 0x0f) << 24) | (buffer[1] << 16) | (buffer[2] << 8) | buffer[3];
      lengthBytes = 4;
    } else if ((length & 0xf8) === 0xf0) {
      if (buffer.length < 5) return { word: null, remaining: buffer };
      length = (buffer[1] << 24) | (buffer[2] << 16) | (buffer[3] << 8) | buffer[4];
      lengthBytes = 5;
    }

    if (buffer.length < lengthBytes + length) {
      return { word: null, remaining: buffer };
    }

    const word = buffer.subarray(lengthBytes, lengthBytes + length).toString();
    const remaining = buffer.subarray(lengthBytes + length);

    return { word, remaining };
  }

  close(): void {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
    this.connected = false;
  }

  // Helper method to execute commands
  async execute(command: string[]): Promise<RouterOSResponse[]> {
    const response = await this.write(command);
    return response.map(([, attrs]) => attrs);
  }
}

export default RouterOSAPI;
