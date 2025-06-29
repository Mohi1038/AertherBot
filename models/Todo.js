const db = require('../config/database');

class Todo {
  static async addTask(userId, guildId, task, deadline = null) {
    await db.query(
      'INSERT INTO user_todos (user_id, guild_id, task, deadline) VALUES ($1, $2, $3, $4)',
      [userId, guildId, task, deadline]
    );
  }

  static async getTasks(userId, guildId) {
    const result = await db.query(
      'SELECT * FROM user_todos WHERE user_id = $1 AND guild_id = $2 AND completed = false ORDER BY deadline ASC',
      [userId, guildId]
    );
    return result.rows;
  }

  static async completeTask(taskId) {
    await db.query(
      'UPDATE user_todos SET completed = true WHERE id = $1',
      [taskId]
    );
  }
}

module.exports = Todo;