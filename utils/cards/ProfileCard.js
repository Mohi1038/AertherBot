const { createCanvas, loadImage } = require('canvas');

class ProfileCard {
  constructor(user, member, userData, studyData, skin = {}) {
    this.user = user;
    this.member = member;
    this.userData = userData;
    this.studyData = studyData;
    this.skin = {
      header: skin.header || '#22304a',
      headerText: skin.headerText || '#FFD700',
      bg: skin.bg || '#1a2235',
      about: skin.about || '#fff',
      ...skin
    };
  }

  async draw() {
    const width = 600, height = 320;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = this.skin.bg;
    ctx.fillRect(0, 0, width, height);

    // Header
    ctx.fillStyle = this.skin.header;
    ctx.fillRect(0, 0, width, 80);

    // Avatar
    const avatarURL = this.user.displayAvatarURL({ extension: 'png', size: 128 });
    const avatar = await loadImage(avatarURL);
    ctx.save();
    ctx.beginPath();
    ctx.arc(70, 120, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 20, 70, 100, 100);
    ctx.restore();

    // Username
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = this.skin.headerText;
    ctx.fillText(this.member.displayName || this.user.username, 140, 120);

    // About
    ctx.font = '20px Arial';
    ctx.fillStyle = this.skin.about;
    ctx.fillText(this.userData?.about || 'No information set yet', 140, 160, 400);

    // Study Time
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = this.skin.headerText;
    ctx.fillText('Study Time:', 140, 210);
    ctx.font = '24px Arial';
    ctx.fillStyle = this.skin.about;
    const totalMinutes = this.studyData?.total_minutes || 0;
    ctx.fillText(`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, 270, 210);

    return canvas.toBuffer();
  }
}

module.exports = ProfileCard; 