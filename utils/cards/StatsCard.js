const { createCanvas, loadImage } = require('canvas');

class StatsCard {
  constructor(user, stats, skin = {}) {
    this.user = user;
    this.stats = stats;
    this.skin = {
      header: skin.header || '#22304a',
      headerText: skin.headerText || '#FFD700',
      bg: skin.bg || '#1a2235',
      text: skin.text || '#fff',
      ...skin
    };
  }

  async draw() {
    const width = 500, height = 220;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = this.skin.bg;
    ctx.fillRect(0, 0, width, height);

    // Header
    ctx.fillStyle = this.skin.header;
    ctx.fillRect(0, 0, width, 60);

    // Avatar
    const avatarURL = this.user.displayAvatarURL({ extension: 'png', size: 128 });
    const avatar = await loadImage(avatarURL);
    ctx.save();
    ctx.beginPath();
    ctx.arc(50, 110, 40, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 10, 70, 80, 80);
    ctx.restore();

    // Username
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = this.skin.headerText;
    ctx.fillText(this.user.username, 110, 100);

    // Total Time
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = this.skin.headerText;
    ctx.fillText('Total Study Time:', 110, 140);
    ctx.font = '22px Arial';
    ctx.fillStyle = this.skin.text;
    const totalMinutes = this.stats?.total_minutes || 0;
    ctx.fillText(`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, 270, 140);

    // Last Updated
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = this.skin.headerText;
    ctx.fillText('Last Updated:', 110, 180);
    ctx.font = '20px Arial';
    ctx.fillStyle = this.skin.text;
    ctx.fillText(
      this.stats?.last_update ? new Date(this.stats.last_update).toLocaleString() : 'Never',
      230, 180
    );

    return canvas.toBuffer();
  }
}

module.exports = StatsCard; 