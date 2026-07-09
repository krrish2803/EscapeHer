const socketService = require('../services/socket.service');

function registerEmergencyHandlers() {
  const io = socketService.getIO();

  io.on('connection', (socket) => {
    socket.on('emergency:start', (data) => {
      const { sessionId } = data;
      if (sessionId) {
        socket.join(`session:${sessionId}`);
        socket.broadcast.to(`session:${sessionId}`).emit('emergency:update', {
          type: 'EMERGENCY_STARTED',
          sessionId,
          ...data,
        });
      }
    });

    socket.on('emergency:subscribe', (sessionId) => {
      if (sessionId) {
        socket.join(`session:${sessionId}`);
      }
    });

    socket.on('emergency:unsubscribe', (sessionId) => {
      if (sessionId) {
        socket.leave(`session:${sessionId}`);
      }
    });
  });
}

module.exports = { registerEmergencyHandlers };
