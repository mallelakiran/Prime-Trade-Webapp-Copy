# Primetrade.ai Task Management System

A full-stack web application built with Node.js, Express, SQLite, and React.js featuring JWT authentication, role-based access control, and comprehensive task management capabilities.

## 🚀 Live Demo

- **Frontend**: [https://your-app.netlify.app](https://your-app.netlify.app)
- **API Documentation**: [https://your-app.netlify.app/api-docs](https://your-app.netlify.app/api-docs)

## 📋 Demo Accounts

### 👤 **Existing Demo Accounts**
- **Admin**: `admin@primetrade.ai` / `Admin123`
- **User**: `user@primetrade.ai` / `User123`

### 🔐 **Admin Registration**
To register as a new admin, you need the admin code: `admin007`

## ✨ Features

### Backend Features
- ✅ **User Authentication**: Secure registration and login with JWT tokens
- ✅ **Role-Based Access Control**: User and Admin roles with different permissions
- ✅ **CRUD Operations**: Complete task management (Create, Read, Update, Delete)
- ✅ **API Versioning**: Structured API endpoints with `/v1/` versioning
- ✅ **Input Validation**: Comprehensive data validation using Joi
- ✅ **Error Handling**: Proper HTTP status codes and error messages
- ✅ **Security**: Password hashing, JWT tokens, rate limiting, CORS, Helmet
- ✅ **Database**: SQLite with normalized schema and indexes
- ✅ **API Documentation**: Interactive Swagger/OpenAPI documentation
- ✅ **Logging**: Request logging with Morgan

### Frontend Features
- ✅ **Modern UI**: Clean, responsive design with Tailwind CSS
- ✅ **Authentication Flow**: Login, registration, and protected routes
- ✅ **Dashboard**: Statistics overview and quick actions
- ✅ **Task Management**: Full CRUD operations with search and filtering
- ✅ **Profile Management**: Update profile and change password
- ✅ **Admin Panel**: User management and system statistics (Admin only)
- ✅ **Real-time Feedback**: Toast notifications for user actions
- ✅ **Mobile Responsive**: Works seamlessly on all device sizes

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React.js 18
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Create React App

### Deployment
- **Platform**: Netlify
- **Functions**: Netlify Functions (Serverless)
- **CI/CD**: Automatic deployment from Git

## 📁 Project Structure

```
primetrade-webapp/
├── src/                          # Backend source code
│   ├── config/                   # Configuration files
│   │   ├── database.js          # SQLite database setup
│   │   └── swagger.js           # API documentation config
│   ├── controllers/             # Request handlers
│   │   ├── authController.js    # Authentication logic
│   │   └── taskController.js    # Task management logic
│   ├── middleware/              # Express middleware
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── errorMiddleware.js   # Error handling
│   │   └── validationMiddleware.js # Input validation
│   ├── models/                  # Data models
│   │   ├── userModel.js         # User database operations
│   │   └── taskModel.js         # Task database operations
│   ├── routes/                  # API routes
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   └── taskRoutes.js        # Task endpoints
│   ├── utils/                   # Utility functions
│   │   ├── jwtUtils.js          # JWT helpers
│   │   └── responseUtils.js     # Response formatting
│   └── server.js                # Express server setup
├── frontend/                    # React frontend
│   ├── public/                  # Static files
│   ├── src/                     # Frontend source code
│   │   ├── components/          # Reusable components
│   │   │   ├── Layout/          # Layout components
│   │   │   └── UI/              # UI components
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.js   # Authentication state
│   │   ├── pages/               # Page components
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Register.js      # Registration page
│   │   │   ├── Dashboard.js     # Dashboard page
│   │   │   ├── Tasks.js         # Task management page
│   │   │   ├── Profile.js       # Profile settings page
│   │   │   └── AdminPanel.js    # Admin panel page
│   │   ├── services/            # API services
│   │   │   ├── api.js           # Axios configuration
│   │   │   └── taskService.js   # Task API calls
│   │   ├── App.js               # Main app component
│   │   └── index.js             # React entry point
│   ├── package.json             # Frontend dependencies
│   └── tailwind.config.js       # Tailwind configuration
├── netlify/                     # Netlify deployment
│   └── functions/               # Serverless functions
│       └── server.js            # Serverless backend
├── database/                    # SQLite database files
├── docs/                        # Documentation
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── netlify.toml                 # Netlify configuration
├── package.json                 # Backend dependencies
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd primetrade-webapp
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   DB_PATH=./database/primetrade.db
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the development servers**
   
   **Backend** (Terminal 1):
   ```bash
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

### Production Build

1. **Build the frontend**
   ```bash
   npm run build:frontend
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📚 API Documentation

The API is fully documented using Swagger/OpenAPI. Access the interactive documentation at:
- Local: http://localhost:5000/api-docs
- Production: https://your-app.netlify.app/api-docs

### Key API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `PUT /api/v1/auth/change-password` - Change password

#### Tasks
- `GET /api/v1/tasks` - Get tasks (filtered by user role)
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/:id` - Get task by ID
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `GET /api/v1/tasks/stats` - Get task statistics

#### Admin Only
- `GET /api/v1/auth/users` - Get all users
- `DELETE /api/v1/auth/users/:id` - Delete user

## 🔐 Security Features

### Backend Security
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Joi schema validation for all inputs
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for secure cross-origin requests
- **Helmet**: Security headers for Express
- **SQL Injection Prevention**: Parameterized queries

### Frontend Security
- **Token Storage**: JWT tokens stored securely
- **Route Protection**: Protected routes for authenticated users
- **Role-based UI**: Different interfaces for users and admins
- **Input Sanitization**: Client-side validation and sanitization

## 🎯 Role-Based Access Control

### User Role
- ✅ Create, read, update, delete their own tasks
- ✅ View their own task statistics
- ✅ Update their profile
- ✅ Change their password

### Admin Role
- ✅ All user permissions
- ✅ View all tasks from all users
- ✅ Delete any task
- ✅ View system-wide statistics
- ✅ Manage users (view, delete)
- ✅ Access admin panel

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

## 🚀 Deployment

### Netlify Deployment

1. **Connect your repository to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
   - Functions directory: `netlify/functions`

3. **Set environment variables**
   ```
   NODE_ENV=production
   JWT_SECRET=your_production_jwt_secret_here
   JWT_EXPIRES_IN=7d
   ```

4. **Deploy**
   - Netlify will automatically build and deploy your application
   - Your app will be available at `https://your-app-name.netlify.app`

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting provider**
   - Upload the `frontend/build` directory for static hosting
   - Deploy the backend to a Node.js hosting service

## 🔧 Environment Variables

### Required Variables
```env
NODE_ENV=development|production
PORT=5000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
DB_PATH=./database/primetrade.db
CORS_ORIGIN=http://localhost:3000
```

### Optional Variables
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### API Testing
Use the provided Postman collection or test via Swagger UI:
- Import the API documentation into Postman
- Test all endpoints with different user roles
- Verify authentication and authorization

## 📈 Scalability Considerations

### Current Architecture
- **Modular Structure**: Easy to add new features and modules
- **Separation of Concerns**: Clear separation between routes, controllers, and models
- **Database Indexing**: Optimized queries with proper indexes
- **Error Handling**: Centralized error handling and logging

### Future Scalability Options

#### Microservices Architecture
- Split authentication and task services
- Use API Gateway for routing
- Implement service discovery

#### Database Scaling
- Migrate from SQLite to PostgreSQL/MySQL
- Implement database connection pooling
- Add read replicas for better performance

#### Caching Layer
- Implement Redis for session storage
- Cache frequently accessed data
- Use CDN for static assets

#### Load Balancing
- Use NGINX or cloud load balancers
- Implement horizontal scaling
- Add health checks and monitoring

#### Monitoring & Logging
- Implement structured logging
- Add application performance monitoring
- Set up error tracking and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Primetrade.ai for the assignment opportunity
- React.js and Node.js communities
- All open-source contributors

## 📞 Support

For support and questions:
- Create an issue in this repository
- Email: your-email@example.com

---

**Built with ❤️ for Primetrade.ai Backend Developer Internship Assignment**
