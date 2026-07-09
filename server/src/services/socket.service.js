const logger = require('../utils/logger');

let io = null;

function initSocket(server) {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`[SOCKET] Client connected: ${socket.id}`);

    socket.on('join-session', (sessionId) => {
      if (!sessionId) return;
      socket.join(`session:${sessionId}`);
      logger.info(`[SOCKET] ${socket.id} joined session:${sessionId}`);
    });

    socket.on('leave-session', (sessionId) => {
      if (!sessionId) return;
      socket.leave(`session:${sessionId}`);
      logger.info(`[SOCKET] ${socket.id} left session:${sessionId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`[SOCKET] Client disconnected: ${socket.id}`);
    });
  });

  logger.info('[SOCKET] Socket.io initialized');
  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket(server) first.');
  }
  return io;
}

function emitEmergencyUpdate(sessionId, data) {
  if (!io) return;
  io.to(`session:${sessionId}`).emit('emergency:update', data);
}

function emitHeartbeatUpdate(sessionId, data) {
  if (!io) return;
  io.to(`session:${sessionId}`).emit('heartbeat:update', data);
}

function emitLocationUpdate(sessionId, data) {
  if (!io) return;
  io.to(`session:${sessionId}`).emit('location:update', data);
}

module.exports = { initSocket, getIO, emitEmergencyUpdate, emitHeartbeatUpdate, emitLocationUpdate };
