require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const dns = require('dns');
const logger = require('./utils/logger');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  logger.warn('Failed to set public DNS servers, using system default:', dnsErr.message);
}

const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');
const { initSocket } = require('./services/socket.service');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escapeher';

async function connectDatabase() {
  const localFallback = 'mongodb://127.0.0.1:27017/escapeher';
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB Atlas connection failed:', err.message);
    if (MONGODB_URI !== localFallback) {
      logger.info(`Attempting fallback to local MongoDB: ${localFallback}`);
      try {
        await mongoose.connect(localFallback, {
          serverSelectionTimeoutMS: 5000,
        });
        logger.info('Connected to local MongoDB');
      } catch (fallbackErr) {
        logger.error('Local MongoDB connection also failed:', fallbackErr.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

async function startServer() {
  await connectDatabase();

  const server = http.createServer(app);

  initSocket(server);

  server.listen(PORT, () => {
    logger.info(`EscapeHer server running on port ${PORT}`);
    logger.info(`Health check: http://localhost:${PORT}/api/health`);
  });

  const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer();
