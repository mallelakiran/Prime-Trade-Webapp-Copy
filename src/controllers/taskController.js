const Task = require('../models/taskModel');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseUtils');

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      user_id: req.user.id
    });

    successResponse(res, { task }, 'Task created successfully', 201);

  } catch (error) {
    console.error('Create task error:', error);
    errorResponse(res, 'Failed to create task', 500);
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let tasks;

    if (search) {
      // Search tasks
      tasks = await Task.searchTasks(search, req.user.id, { 
        limit: parseInt(limit), 
        offset 
      });
    } else {
      // Get tasks with filters
      const isAdmin = req.user.role === 'admin';
      const userId = isAdmin ? null : req.user.id; // Admins can see all tasks

      tasks = await Task.findAll({
        status,
        priority,
        user_id: userId,
        limit: parseInt(limit),
        offset
      });
    }

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: tasks.length,
      hasNext: tasks.length === parseInt(limit),
      hasPrev: page > 1
    };

    paginatedResponse(res, { tasks }, pagination, 'Tasks retrieved successfully');

  } catch (error) {
    console.error('Get tasks error:', error);
    errorResponse(res, 'Failed to retrieve tasks', 500);
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    // Check if user has permission to view this task
    if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
      return errorResponse(res, 'Access denied', 403);
    }

    successResponse(res, { task }, 'Task retrieved successfully');

  } catch (error) {
    console.error('Get task by ID error:', error);
    errorResponse(res, 'Failed to retrieve task', 500);
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;

    if (Object.keys(updates).length === 0) {
      return errorResponse(res, 'No valid fields provided for update', 400);
    }

    // Regular users can only update their own tasks
    const userId = req.user.role === 'admin' ? null : req.user.id;
    
    const task = await Task.updateById(id, updates, userId);

    successResponse(res, { task }, 'Task updated successfully');

  } catch (error) {
    console.error('Update task error:', error);
    
    if (error.message === 'Task not found or access denied') {
      return errorResponse(res, error.message, 404);
    }
    
    errorResponse(res, 'Failed to update task', 500);
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Regular users can only delete their own tasks
    const userId = req.user.role === 'admin' ? null : req.user.id;
    
    const deleted = await Task.deleteById(id, userId);

    if (!deleted) {
      return errorResponse(res, 'Task not found or access denied', 404);
    }

    successResponse(res, null, 'Task deleted successfully');

  } catch (error) {
    console.error('Delete task error:', error);
    errorResponse(res, 'Failed to delete task', 500);
  }
};

const getTaskStats = async (req, res) => {
  try {
    // Regular users get their own stats, admins get global stats
    const userId = req.user.role === 'admin' ? null : req.user.id;
    const stats = await Task.getTaskStats(userId);

    successResponse(res, { stats }, 'Task statistics retrieved successfully');

  } catch (error) {
    console.error('Get task stats error:', error);
    errorResponse(res, 'Failed to retrieve task statistics', 500);
  }
};

const getMyTasks = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const tasks = await Task.findByUserId(req.user.id, {
      status,
      priority,
      limit: parseInt(limit),
      offset
    });

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: tasks.length,
      hasNext: tasks.length === parseInt(limit),
      hasPrev: page > 1
    };

    paginatedResponse(res, { tasks }, pagination, 'Your tasks retrieved successfully');

  } catch (error) {
    console.error('Get my tasks error:', error);
    errorResponse(res, 'Failed to retrieve your tasks', 500);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
  getMyTasks
};
