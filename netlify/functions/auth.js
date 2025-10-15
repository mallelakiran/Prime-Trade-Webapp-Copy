const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Demo users
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

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production',
    { expiresIn: '7d' }
  );
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/auth', '');
    console.log('Auth function - Method:', event.httpMethod, 'Path:', path);

    // Handle login
    if (event.httpMethod === 'POST' && (path === '/login' || path === '')) {
      const { email, password } = JSON.parse(event.body);
      
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

    // Handle profile
    if (event.httpMethod === 'GET' && path === '/profile') {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production');
        
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

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ status: 'error', message: 'Not found' })
    };

  } catch (error) {
    console.error('Auth function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ status: 'error', message: 'Internal server error' })
    };
  }
};
