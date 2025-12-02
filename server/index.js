import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import prisma from './database/prisma.js';
import attendeeRoutes from './routes/attendeeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// CORS configuration - allow frontend domain
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Set your frontend URL in Vercel env vars
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
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

// Connect to database and start server (only for non-serverless environments)
const startServer = async () => {
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.log('✅ Prisma Connected to MySQL');
    
    // Only start listening if not in Vercel serverless environment
    if (!process.env.VERCEL) {
      app.listen(config.PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${config.PORT}`);
        console.log(`📱 Mobile scanner can connect at: http://<your-ip>:${config.PORT}/api`);
      });
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

// Graceful shutdown (only for non-serverless)
if (!process.env.VERCEL) {
  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  startServer();
}

export default app;

