import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import prisma from './database/prisma.js';
import attendeeRoutes from './routes/attendeeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', attendeeRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.log('✅ Prisma Connected to MySQL');
    
    app.listen(config.PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${config.PORT}`);
      console.log(`📱 Mobile scanner can connect at: http://<your-ip>:${config.PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

export default app;

