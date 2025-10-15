const bcrypt = require('bcryptjs');
const { runQuery, getRow, getAllRows } = require('../config/database');

class User {
  static async create({ username, email, password, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await runQuery(
      `INSERT INTO users (username, email, password, role) 
       VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, role]
    );

    return this.findById(result.id);
  }

  static async findById(id) {
    return await getRow(
      'SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
  }

  static async findByEmail(email) {
    return await getRow(
      'SELECT id, username, email, password, role, created_at, updated_at FROM users WHERE email = ?',
      [email]
    );
  }

  static async findByUsername(username) {
    return await getRow(
      'SELECT id, username, email, role, created_at, updated_at FROM users WHERE username = ?',
      [username]
    );
  }

  static async findAll() {
    return await getAllRows(
      'SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
  }

  static async updateById(id, updates) {
    const allowedUpdates = ['username', 'email', 'role'];
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
    updateValues.push(id);

    await runQuery(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = ? WHERE id = ?`,
      updateValues
    );

    return this.findById(id);
  }

  static async deleteById(id) {
    const result = await runQuery('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await runQuery(
      'UPDATE users SET password = ?, updated_at = ? WHERE id = ?',
      [hashedPassword, new Date().toISOString(), id]
    );

    return this.findById(id);
  }

  static async getUserStats() {
    const totalUsers = await getRow('SELECT COUNT(*) as count FROM users');
    const adminUsers = await getRow('SELECT COUNT(*) as count FROM users WHERE role = "admin"');
    const regularUsers = await getRow('SELECT COUNT(*) as count FROM users WHERE role = "user"');

    return {
      total: totalUsers.count,
      admins: adminUsers.count,
      users: regularUsers.count
    };
  }
}

module.exports = User;
