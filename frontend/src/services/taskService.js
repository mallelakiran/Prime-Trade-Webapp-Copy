import api from './api';

export const taskService = {
  // Get all tasks (admin sees all, users see their own)
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get current user's tasks
  getMyTasks: async (params = {}) => {
    const response = await api.get('/tasks/my', { params });
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Get task statistics
  getTaskStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },

  // Search tasks
  searchTasks: async (searchTerm, params = {}) => {
    const response = await api.get('/tasks', { 
      params: { ...params, search: searchTerm } 
    });
    return response.data;
  }
};

export default taskService;
