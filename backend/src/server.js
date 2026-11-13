import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

let server;

// Start server function
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start Express listening
    server = app.listen(PORT, () => {
      console.log('================================================');
      console.log(`🎶 VIBELY API running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`🚀 Server listening on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log('================================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown handling
const handleShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
  if (server) {
    server.close(() => {
      console.log('🔒 Closed out remaining connections.');
      process.exit(0);
    });

    // Force shutdown after 10 seconds timeout
    setTimeout(() => {
      console.error('⚠️ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

startServer();
