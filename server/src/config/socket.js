const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

/**
 * Initialise Socket.IO on the given HTTP server.
 * - Authenticates connections via JWT in `auth.token`.
 * - Registers core event handlers for emergency, heartbeat, and location.
 * - Returns the `io` instance for use by services.
 */
function configureSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ["websocket", "polling"],
  });

  /* ── Authentication middleware ────────────────────────────────────── */
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication token is required"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id || decoded.userId;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  /* ── Connection handler ──────────────────────────────────────────── */
  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.info(`[Socket] User connected: ${userId} (${socket.id})`);

    /* Join a personal room so we can target individual users */
    socket.join(`user:${userId}`);

    /* ── Emergency events ──────────────────────────────────────────── */
    socket.on("emergency:trigger", (data) => {
      console.info(`[Socket] Emergency triggered by ${userId}`);
      /* Broadcast to all connected clients (trusted contacts will filter) */
      io.emit("emergency:update", {
        userId,
        ...data,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("emergency:cancel", (sessionId) => {
      console.info(`[Socket] Emergency cancelled: ${sessionId}`);
      io.emit("emergency:resolved", { sessionId, userId });
    });

    /* ── Heartbeat events ──────────────────────────────────────────── */
    socket.on("heartbeat:ping", (data) => {
      /* Acknowledge back to sender */
      socket.emit("heartbeat:ack", {
        timestamp: new Date().toISOString(),
        received: true,
      });

      /* Broadcast location to user's room (shared tracking) */
      io.to(`user:${userId}`).emit("location:update", {
        userId,
        ...data,
        timestamp: new Date().toISOString(),
      });
    });

    /* ── Location events ───────────────────────────────────────────── */
    socket.on("location:update", (data) => {
      io.to(`user:${userId}`).emit("location:update", {
        userId,
        ...data,
        timestamp: new Date().toISOString(),
      });
    });

    /* ── Disconnect ────────────────────────────────────────────────── */
    socket.on("disconnect", (reason) => {
      console.info(`[Socket] User disconnected: ${userId} (${reason})`);
    });

    socket.on("error", (err) => {
      console.error(`[Socket] Error for ${userId}:`, err.message);
    });
  });

  return io;
}

module.exports = configureSocket;
