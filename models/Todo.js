const db = require('../config/database');

class Todo {
  static async addTask(userId, guildId, task, deadline = null) {
    await db.execute(
      'INSERT INTO user_todos (user_id, guild_id, task, deadline) VALUES (?, ?, ?, ?)',
      [userId, guildId, task, deadline]
    );
  }

  static async getTasks(userId, guildId) {
    const [rows] = await db.execute(
      'SELECT * FROM user_todos WHERE user_id = ? AND guild_id = ? AND completed = 0 ORDER BY deadline ASC',
      [userId, guildId]
    );
    return rows;
  }

  static async completeTask(taskId) {
    await db.execute(
      'UPDATE user_todos SET completed = 1 WHERE id = ?',
      [taskId]
    );
  }
}

module.exports = Todo;