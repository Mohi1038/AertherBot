const db = require('../config/database');

class User {
  static async get(userId, guildId) {
    const [rows] = await db.execute(
      'SELECT * FROM user_profiles WHERE user_id = ? AND guild_id = ?',
      [userId, guildId]
    );
    return rows[0];
  }

  static async update(userId, guildId, data) {
    await db.execute(
      `INSERT INTO user_profiles (user_id, guild_id, about, reminder_frequency, reminder_time)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       about = VALUES(about),
       reminder_frequency = VALUES(reminder_frequency),
       reminder_time = VALUES(reminder_time)`,
      [userId, guildId, data.about || null, data.reminder_frequency || null, data.reminder_time || null]
    );
  }
}

module.exports = User;