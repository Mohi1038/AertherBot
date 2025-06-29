const db = require('../config/database');

class User {
  static async get(userId, guildId) {
    const result = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = $1 AND guild_id = $2',
      [userId, guildId]
    );
    return result.rows[0];
  }

  static async update(userId, guildId, data) {
    await db.query(
      `INSERT INTO user_profiles (user_id, guild_id, about, reminder_frequency, reminder_time)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, guild_id) DO UPDATE SET
       about = EXCLUDED.about,
       reminder_frequency = EXCLUDED.reminder_frequency,
       reminder_time = EXCLUDED.reminder_time`,
      [userId, guildId, data.about || null, data.reminder_frequency || null, data.reminder_time || null]
    );
  }
}

module.exports = User;