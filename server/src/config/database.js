const mongoose = require("mongoose");

/**
 * Connect to MongoDB Atlas.
 * Reads MONGODB_URI from environment, includes retry logic and event logging.
 */
async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("[Database] MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  const options = {
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  mongoose.connection.on("connected", () => {
    console.info("[Database] MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[Database] MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[Database] MongoDB disconnected");
  });

  /* Graceful shutdown */
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.info("[Database] MongoDB connection closed via SIGINT");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await mongoose.connection.close();
    console.info("[Database] MongoDB connection closed via SIGTERM");
    process.exit(0);
  });

  try {
    await mongoose.connect(uri, options);
  } catch (err) {
    console.error("[Database] Initial connection failed:", err.message);
    /* Retry once after 5 seconds */
    console.info("[Database] Retrying connection in 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    try {
      await mongoose.connect(uri, options);
    } catch (retryErr) {
      console.error("[Database] Retry failed:", retryErr.message);
      process.exit(1);
    }
  }
}

module.exports = connectDatabase;
