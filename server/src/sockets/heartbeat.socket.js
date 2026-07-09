const socketService = require('../services/socket.service');

function registerHeartbeatHandlers() {
  const io = socketService.getIO();

  io.on('connection', (socket) => {
    socket.on('heartbeat:subscribe', (sessionId) => {
      if (sessionId) {
        socket.join(`session:${sessionId}`);
      }
    });

    socket.on('heartbeat:checkin', (data) => {
      const { sessionId, sequence } = data;
      if (sessionId) {
        socket.to(`session:${sessionId}`).emit('heartbeat:update', {
          type: 'HEARTBEAT_RECEIVED',
          sessionId,
          sequence,
        });
      }
    });
  });
}

module.exports = { registerHeartbeatHandlers };
