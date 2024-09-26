// src/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}
