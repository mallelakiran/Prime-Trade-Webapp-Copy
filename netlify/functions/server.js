const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

// Set environment variables for serverless
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
process.env.DB_PATH = process.env.DB_PATH || '/tmp/primetrade.db';

const { initializeDatabase } = require('../../src/config/database');
const { errorHandler, notFound } = require('../../src/middleware/errorMiddleware');
const { seedDatabase } = require('../../src/utils/seedDatabase');

// Import routes
const authRoutes = require('../../src/routes/authRoutes');
const taskRoutes = require('../../src/routes/taskRoutes');
const swaggerSetup = require('../../src/config/swagger');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Headers:`, JSON.stringify(req.headers, null, 2));
  next();
});

// API routes (adjusted for Netlify redirects)
// When /api/v1/auth/login is redirected, it becomes v1/auth/login
app.use('/v1/auth', authRoutes);
app.use('/v1/tasks', taskRoutes);

// Swagger documentation
swaggerSetup(app);

// Health check endpoint
app.get('/v1/health', async (req, res) => {
  try {
    const { getRow } = require('../../src/config/database');
    const userCount = await getRow('SELECT COUNT(*) as count FROM users');
    
    res.status(200).json({
      status: 'success',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        initialized: dbInitialized,
        userCount: userCount?.count || 0,
        dbPath: process.env.DB_PATH
      }
    });
  } catch (error) {
    res.status(200).json({
      status: 'success',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        initialized: dbInitialized,
        error: error.message,
        dbPath: process.env.DB_PATH
      }
    });
  }
});

// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log('Catch-all route hit:', req.method, req.originalUrl, req.path);
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    debug: {
      method: req.method,
      originalUrl: req.originalUrl,
      path: req.path,
      baseUrl: req.baseUrl
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize database
let dbInitialized = false;

// In-memory fallback users for serverless environment
const fallbackUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@primetrade.ai',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5W', // Admin123
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    username: 'user',
    email: 'user@primetrade.ai', 
    password: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // User123
    role: 'user',
    created_at: new Date().toISOString()
  }
];

// Override User model methods for serverless environment
const User = require('../../src/models/userModel');
const bcrypt = require('bcryptjs');

User.findByEmail = async (email) => {
  return fallbackUsers.find(u => u.email === email) || null;
};

User.validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

User.findById = async (id) => {
  const user = fallbackUsers.find(u => u.id === parseInt(id));
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Simple task store for demo
const fallbackTasks = [
  {
    id: 1,
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the task management system',
    status: 'in_progress',
    priority: 'high',
    user_id: 1,
    username: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Review code quality',
    description: 'Perform code review and ensure best practices are followed',
    status: 'pending',
    priority: 'medium',
    user_id: 1,
    username: 'admin',
    created_at: new Date().toISOString()
  }
];

// Add a simple tasks endpoint
app.get('/v1/tasks', (req, res) => {
  res.json({
    status: 'success',
    message: 'Tasks retrieved successfully',
    data: {
      tasks: fallbackTasks,
      total: fallbackTasks.length
    }
  });
});

app.get('/v1/tasks/stats', (req, res) => {
  const stats = {
    total: fallbackTasks.length,
    pending: fallbackTasks.filter(t => t.status === 'pending').length,
    in_progress: fallbackTasks.filter(t => t.status === 'in_progress').length,
    completed: fallbackTasks.filter(t => t.status === 'completed').length
  };
  
  res.json({
    status: 'success',
    message: 'Task statistics retrieved successfully',
    data: { stats }
  });
});

const initializeApp = async () => {
  if (!dbInitialized) {
    try {
      console.log('🔄 Using in-memory user store for serverless environment');
      console.log('✅ Fallback users loaded:', fallbackUsers.length);
      dbInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize:', error);
    }
  }
};

// Wrap the app with serverless-http
const handler = serverless(app, {
  binary: ['image/*', 'font/*', 'application/octet-stream']
});

module.exports.handler = async (event, context) => {
  // Initialize database on cold start
  await initializeApp();
  
  // Handle the request
  return await handler(event, context);
};
