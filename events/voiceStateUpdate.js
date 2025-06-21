const tracker = require('../utils/timeTracking');

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    // Ignore bots
    if (oldState.member.user.bot) return;

    const userLeft = oldState.channelId && !newState.channelId;
    const userJoined = !oldState.channelId && newState.channelId;
    const userSwitched = oldState.channelId && newState.channelId;

    if (userLeft) {
      tracker.stopTracking(oldState.member);
    } else if (userJoined) {
      tracker.startTracking(newState.member);
    } else if (userSwitched) {
      tracker.stopTracking(oldState.member);
      tracker.startTracking(newState.member);
    }
  }
};