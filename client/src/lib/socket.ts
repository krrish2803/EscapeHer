import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "@/constants/api";
import { getToken } from "./helpers";

export type SocketEventMap = {
  /* Client → Server */
  "emergency:trigger": (payload: {
    latitude: number;
    longitude: number;
    severity: string;
  }) => void;
  "emergency:cancel": (sessionId: string) => void;
  "heartbeat:ping": (payload: {
    latitude: number;
    longitude: number;
    batteryLevel?: number;
  }) => void;
  "location:update": (payload: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  }) => void;

  /* Server → Client */
  "emergency:update": (data: unknown) => void;
  "emergency:resolved": (data: unknown) => void;
  "contact:notified": (data: { contactId: string; status: string }) => void;
  "heartbeat:ack": (data: { timestamp: string }) => void;
  "alert:received": (data: { message: string; severity: string }) => void;
  "evidence:captured": (data: { evidenceId: string; type: string }) => void;
};

let socket: Socket | null = null;

/**
 * Get or create a singleton Socket.IO connection.
 * Automatically attaches the JWT for authentication.
 */
export function getSocket(): Socket {
  if (socket?.connected) return socket;

  const token = getToken();

  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    timeout: 20000,
    transports: ["websocket", "polling"],
    auth: { token },
  });

  socket.on("connect", () => {
    console.info("[Socket] Connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.warn("[Socket] Disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Connection error:", error.message);
  });

  return socket;
}

/**
 * Disconnect the socket and clear the singleton.
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

/**
 * Check whether the socket is currently connected.
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

export default getSocket;
