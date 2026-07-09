const socketService = require('../services/socket.service');

function registerLocationHandlers() {
  const io = socketService.getIO();

  io.on('connection', (socket) => {
    socket.on('location:subscribe', (sessionId) => {
      if (sessionId) {
        socket.join(`session:${sessionId}`);
      }
    });

    socket.on('location:ping', (data) => {
      const { sessionId, latitude, longitude } = data;
      if (sessionId) {
        socket.to(`session:${sessionId}`).emit('location:update', {
          type: 'LOCATION_UPDATED',
          sessionId,
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        });
      }
    });
  });
}

module.exports = { registerLocationHandlers };
