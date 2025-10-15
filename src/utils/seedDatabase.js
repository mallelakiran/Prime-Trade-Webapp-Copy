const bcrypt = require('bcryptjs');
const { runQuery, getRow } = require('../config/database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if admin user already exists
    const existingAdmin = await getRow('SELECT id FROM users WHERE email = ?', ['admin@primetrade.ai']);
    
    if (!existingAdmin) {
      // Create admin user
      const adminPassword = await bcrypt.hash('Admin123', 12);
      await runQuery(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@primetrade.ai', adminPassword, 'admin']
      );
      console.log('✅ Admin user created: admin@primetrade.ai / Admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Check if regular user already exists
    const existingUser = await getRow('SELECT id FROM users WHERE email = ?', ['user@primetrade.ai']);
    
    if (!existingUser) {
      // Create regular user
      const userPassword = await bcrypt.hash('User123', 12);
      await runQuery(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['user', 'user@primetrade.ai', userPassword, 'user']
      );
      console.log('✅ Regular user created: user@primetrade.ai / User123');
    } else {
      console.log('ℹ️  Regular user already exists');
    }

    // Get user IDs for creating sample tasks
    const adminUser = await getRow('SELECT id FROM users WHERE email = ?', ['admin@primetrade.ai']);
    const regularUser = await getRow('SELECT id FROM users WHERE email = ?', ['user@primetrade.ai']);

    // Check if sample tasks exist
    const existingTasks = await getRow('SELECT COUNT(*) as count FROM tasks');
    
    if (existingTasks.count === 0) {
      // Create sample tasks
      const sampleTasks = [
        {
          title: 'Complete project documentation',
          description: 'Write comprehensive documentation for the task management system',
          status: 'in_progress',
          priority: 'high',
          user_id: adminUser.id
        },
        {
          title: 'Review code quality',
          description: 'Perform code review and ensure best practices are followed',
          status: 'pending',
          priority: 'medium',
          user_id: adminUser.id
        },
        {
          title: 'Setup CI/CD pipeline',
          description: 'Configure automated testing and deployment pipeline',
          status: 'completed',
          priority: 'high',
          user_id: adminUser.id
        },
        {
          title: 'Learn React hooks',
          description: 'Study and practice React hooks for better state management',
          status: 'in_progress',
          priority: 'medium',
          user_id: regularUser.id
        },
        {
          title: 'Update profile information',
          description: 'Complete personal profile with relevant information',
          status: 'pending',
          priority: 'low',
          user_id: regularUser.id
        },
        {
          title: 'Test API endpoints',
          description: 'Thoroughly test all API endpoints for proper functionality',
          status: 'completed',
          priority: 'high',
          user_id: regularUser.id
        }
      ];

      for (const task of sampleTasks) {
        await runQuery(
          'INSERT INTO tasks (title, description, status, priority, user_id) VALUES (?, ?, ?, ?, ?)',
          [task.title, task.description, task.status, task.priority, task.user_id]
        );
      }
      
      console.log('✅ Sample tasks created');
    } else {
      console.log('ℹ️  Sample tasks already exist');
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('👤 Admin: admin@primetrade.ai / Admin123');
    console.log('👤 User: user@primetrade.ai / User123');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};

module.exports = { seedDatabase };
