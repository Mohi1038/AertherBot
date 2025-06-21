const db = require('../config/database');

// Test connection immediately
db.execute('SELECT 1')
  .then(() => console.log('✅ StudyTime DB connection verified'))
  .catch(err => {
    console.error('❌ StudyTime DB connection failed:', err);
    process.exit(1);
  });

const StudyTime = {
  updateTime: async (userId, guildId, minutes) => {
    try {
      await db.execute(
        `INSERT INTO user_study_time (user_id, guild_id, total_minutes)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
         total_minutes = total_minutes + VALUES(total_minutes),
         last_update = CURRENT_TIMESTAMP`,
        [userId, guildId, minutes]
      );
      return true;
    } catch (error) {
      console.error('UpdateTime error:', error);
      throw error;
    }
  },

  get: async (userId, guildId) => {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM user_study_time WHERE user_id = ? AND guild_id = ?',
        [userId, guildId]
      );
      return rows[0];
    } catch (error) {
      console.error('Get error:', error);
      throw error;
    }
  }
};

// Lock the object to prevent modifications
module.exports = Object.freeze(StudyTime);