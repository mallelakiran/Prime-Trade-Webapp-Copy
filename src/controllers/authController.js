const User = require('../models/userModel');
const { generateToken } = require('../utils/jwtUtils');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const register = async (req, res) => {
  try {
    const { username, email, password, role, adminCode } = req.body;

    // Check if user already exists
    const existingUserByEmail = await User.findByEmail(email);
    if (existingUserByEmail) {
      return errorResponse(res, 'User with this email already exists', 400);
    }

    const existingUserByUsername = await User.findByUsername(username);
    if (existingUserByUsername) {
      return errorResponse(res, 'Username already taken', 400);
    }

    // Validate admin code if role is admin
    if (role === 'admin') {
      const ADMIN_CODE = process.env.ADMIN_CODE || 'admin007';
      if (!adminCode || adminCode !== ADMIN_CODE) {
        return errorResponse(res, 'Invalid admin code. Please contact administrator for the correct code.', 403);
      }
    }

    // Create new user
    const user = await User.create({ username, email, password, role: role || 'user' });
    
    // Generate JWT token
    const token = generateToken(user.id);

    successResponse(res, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    }, 'User registered successfully', 201);

  } catch (error) {
    console.error('Registration error:', error);
    errorResponse(res, 'Registration failed', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Validate password
    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken(user.id);

    successResponse(res, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, 'Login failed', 500);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }
    }, 'Profile retrieved successfully');

  } catch (error) {
    console.error('Get profile error:', error);
    errorResponse(res, 'Failed to retrieve profile', 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;

    if (Object.keys(updates).length === 0) {
      return errorResponse(res, 'No valid fields provided for update', 400);
    }

    // Check if new email/username already exists
    if (email && email !== req.user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return errorResponse(res, 'Email already in use', 400);
      }
    }

    if (username && username !== req.user.username) {
      const existingUser = await User.findByUsername(username);
      if (existingUser && existingUser.id !== req.user.id) {
        return errorResponse(res, 'Username already taken', 400);
      }
    }

    const updatedUser = await User.updateById(req.user.id, updates);

    successResponse(res, {
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    }, 'Profile updated successfully');

  } catch (error) {
    console.error('Update profile error:', error);
    errorResponse(res, 'Failed to update profile', 500);
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get current user with password
    const user = await User.findByEmail(req.user.email);
    
    // Validate current password
    const isValidPassword = await User.validatePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    // Update password
    await User.changePassword(req.user.id, newPassword);

    successResponse(res, null, 'Password changed successfully');

  } catch (error) {
    console.error('Change password error:', error);
    errorResponse(res, 'Failed to change password', 500);
  }
};

// Admin only endpoints
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    const stats = await User.getUserStats();

    successResponse(res, {
      users,
      stats
    }, 'Users retrieved successfully');

  } catch (error) {
    console.error('Get all users error:', error);
    errorResponse(res, 'Failed to retrieve users', 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return errorResponse(res, 'Cannot delete your own account', 400);
    }

    const deleted = await User.deleteById(id);
    
    if (!deleted) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, null, 'User deleted successfully');

  } catch (error) {
    console.error('Delete user error:', error);
    errorResponse(res, 'Failed to delete user', 500);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUser
};
