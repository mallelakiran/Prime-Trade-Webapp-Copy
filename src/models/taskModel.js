const { runQuery, getRow, getAllRows } = require('../config/database');

class Task {
  static async create({ title, description, status = 'pending', priority = 'medium', user_id }) {
    const result = await runQuery(
      `INSERT INTO tasks (title, description, status, priority, user_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, status, priority, user_id]
    );

    return this.findById(result.id);
  }

  static async findById(id) {
    return await getRow(
      `SELECT t.*, u.username, u.email as user_email 
       FROM tasks t 
       LEFT JOIN users u ON t.user_id = u.id 
       WHERE t.id = ?`,
      [id]
    );
  }

  static async findByUserId(userId, options = {}) {
    const { status, priority, limit = 50, offset = 0 } = options;
    
    let query = `
      SELECT t.*, u.username, u.email as user_email 
      FROM tasks t 
      LEFT JOIN users u ON t.user_id = u.id 
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return await getAllRows(query, params);
  }

  static async findAll(options = {}) {
    const { status, priority, user_id, limit = 50, offset = 0 } = options;
    
    let query = `
      SELECT t.*, u.username, u.email as user_email 
      FROM tasks t 
      LEFT JOIN users u ON t.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (user_id) {
      query += ' AND t.user_id = ?';
      params.push(user_id);
    }

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return await getAllRows(query, params);
  }

  static async updateById(id, updates, userId = null) {
    const allowedUpdates = ['title', 'description', 'status', 'priority'];
    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateValues.push(new Date().toISOString());
    
    let query = `UPDATE tasks SET ${updateFields.join(', ')}, updated_at = ? WHERE id = ?`;
    updateValues.push(id);

    // If userId is provided, ensure user can only update their own tasks
    if (userId) {
      query += ' AND user_id = ?';
      updateValues.push(userId);
    }

    const result = await runQuery(query, updateValues);
    
    if (result.changes === 0) {
      throw new Error('Task not found or access denied');
    }

    return this.findById(id);
  }

  static async deleteById(id, userId = null) {
    let query = 'DELETE FROM tasks WHERE id = ?';
    const params = [id];

    // If userId is provided, ensure user can only delete their own tasks
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    const result = await runQuery(query, params);
    return result.changes > 0;
  }

  static async getTaskStats(userId = null) {
    let baseQuery = 'SELECT COUNT(*) as count FROM tasks';
    const params = [];

    if (userId) {
      baseQuery += ' WHERE user_id = ?';
      params.push(userId);
    }

    const total = await getRow(baseQuery, params);

    const statusQuery = userId 
      ? 'SELECT status, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY status'
      : 'SELECT status, COUNT(*) as count FROM tasks GROUP BY status';
    
    const statusParams = userId ? [userId] : [];
    const statusStats = await getAllRows(statusQuery, statusParams);

    const priorityQuery = userId 
      ? 'SELECT priority, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY priority'
      : 'SELECT priority, COUNT(*) as count FROM tasks GROUP BY priority';
    
    const priorityStats = await getAllRows(priorityQuery, statusParams);

    return {
      total: total.count,
      byStatus: statusStats.reduce((acc, stat) => {
        acc[stat.status] = stat.count;
        return acc;
      }, {}),
      byPriority: priorityStats.reduce((acc, stat) => {
        acc[stat.priority] = stat.count;
        return acc;
      }, {})
    };
  }

  static async searchTasks(searchTerm, userId = null, options = {}) {
    const { limit = 50, offset = 0 } = options;
    
    let query = `
      SELECT t.*, u.username, u.email as user_email 
      FROM tasks t 
      LEFT JOIN users u ON t.user_id = u.id 
      WHERE (t.title LIKE ? OR t.description LIKE ?)
    `;
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];

    if (userId) {
      query += ' AND t.user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return await getAllRows(query, params);
  }
}

module.exports = Task;
