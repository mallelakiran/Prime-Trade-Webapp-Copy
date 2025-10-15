const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Demo users with pre-hashed passwords
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@primetrade.ai',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5W', // Admin123
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    email: 'user@primetrade.ai', 
    password: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // User123
    role: 'user'
  }
];

const tasks = [
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

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production',
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production');
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/api', '');
    const method = event.httpMethod;
    
    console.log('API Request:', method, path);

    // AUTH ENDPOINTS
    if (method === 'POST' && path === '/v1/auth/login') {
      const { email, password } = JSON.parse(event.body);
      
      console.log('Login attempt for:', email);
      
      const user = users.find(u => u.email === email);
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            status: 'error',
            message: 'Invalid email or password'
          })
        };
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            status: 'error',
            message: 'Invalid email or password'
          })
        };
      }
      
      const token = generateToken(user.id);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Login successful',
          data: {
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role
            },
            token
          }
        })
      };
    }

    if (method === 'GET' && path === '/v1/auth/profile') {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ status: 'error', message: 'No token provided' })
        };
      }
      
      try {
        const token = authHeader.substring(7);
        const decoded = verifyToken(token);
        
        const user = users.find(u => u.id === decoded.id);
        if (!user) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ status: 'error', message: 'User not found' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            status: 'success',
            message: 'Profile retrieved successfully',
            data: {
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
              }
            }
          })
        };
      } catch (error) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ status: 'error', message: 'Invalid token' })
        };
      }
    }

    // TASK ENDPOINTS
    if (method === 'GET' && path === '/v1/tasks') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Tasks retrieved successfully',
          data: {
            tasks: tasks,
            total: tasks.length
          }
        })
      };
    }

    if (method === 'GET' && path === '/v1/tasks/stats') {
      const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Task statistics retrieved successfully',
          data: { stats }
        })
      };
    }

    // HEALTH CHECK
    if (method === 'GET' && path === '/v1/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'API is running',
          users: users.length,
          tasks: tasks.length
        })
      };
    }

    // Not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Endpoint not found',
        path: path,
        method: method
      })
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      })
    };
  }
};
