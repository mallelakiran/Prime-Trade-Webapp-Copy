const bcrypt = require('bcryptjs');

// In-memory user store (for demo purposes)
const users = [
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

const generateToken = (userId) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const path = event.path.replace('/.netlify/functions/simple-auth', '');
    const method = event.httpMethod;
    
    console.log('Request:', method, path);
    
    if (method === 'POST' && path === '/login') {
      const { email, password } = JSON.parse(event.body);
      
      console.log('Login attempt for:', email);
      
      // Find user
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
      
      // Validate password
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
      
      // Generate token
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
    
    if (method === 'GET' && path === '/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Simple auth service is running',
          users: users.length
        })
      };
    }
    
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Not found'
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
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
