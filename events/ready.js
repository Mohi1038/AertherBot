const timeTracker = require('../utils/timeTracking');
const db = require('../config/database');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ Logged in as ${client.user.tag}`);
        
        // Initialize existing voice connections
        client.guilds.cache.forEach(guild => {
            guild.voiceStates.cache.forEach(voiceState => {
                if (voiceState.channelId && !voiceState.member.user.bot) {
                    timeTracker.startTracking(voiceState.member);
                }
            });
        });

        // Update bot status
        const updateStatus = async () => {
            try {
                const [rows] = await db.execute(
                    'SELECT SUM(total_minutes) as total FROM user_study_time'
                );
                const totalHours = Math.floor((rows[0]?.total || 0) / 60);
                client.user.setActivity(`${totalHours} study hours tracked`, { 
                    type: 'WATCHING' 
                });
            } catch (error) {
                console.error('Status update failed:', error);
            }
        };

        // Update immediately and every 5 minutes
        await updateStatus();
        setInterval(updateStatus, 300000);
    }
};