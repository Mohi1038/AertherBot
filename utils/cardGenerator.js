const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

// Registering a more modern font
// For example, let's use a common system font that looks good.
// You can replace 'Helvetica' with any font installed on your system or provide a path to a .ttf file.
// registerFont(path.join(__dirname, '../assets/fonts/Helvetica.ttf'), { family: 'Helvetica' });
const FONT_FAMILY_BOLD = 'bold 24px Helvetica, Arial, sans-serif';
const FONT_FAMILY_REGULAR = '20px Helvetica, Arial, sans-serif';
const FONT_FAMILY_SMALL = '16px Helvetica, Arial, sans-serif';

function formatTime(totalMinutes) {
  if (totalMinutes === undefined || totalMinutes === null) {
    return '0h 0m';
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

// Helper to draw a rounded image
function drawRoundedImage(ctx, image, x, y, width, height, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
}

// Helper for wrapping text
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
            lineCount++;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
    return lineCount + 1;
}

async function generateProfileCard(user, member, userData, studyData) {
  const width = 800;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Create a gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#23272A');
  gradient.addColorStop(1, '#2C2F33');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Card background
  ctx.fillStyle = '#1c1e21';
  ctx.roundRect(20, 20, width - 40, height - 40, 20);
  ctx.fill();
  ctx.strokeStyle = '#5865F2';
  ctx.lineWidth = 4;
  ctx.stroke();


  // Avatar
  const avatarURL = user.displayAvatarURL({ extension: 'png', size: 256 });
  const avatar = await loadImage(avatarURL);
  drawRoundedImage(ctx, avatar, 50, 75, 150, 150, 30);
  
  // Status indicator
  const statusColor = {
    online: '#43B581',
    idle: '#FAA61A',
    dnd: '#F04747',
    offline: '#747F8D'
  };
  const status = member?.presence?.status || 'offline';
  ctx.fillStyle = statusColor[status];
  ctx.beginPath();
  ctx.arc(175, 200, 20, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.strokeStyle = '#1c1e21';
  ctx.lineWidth = 5;
  ctx.stroke();


  // Username
  ctx.font = 'bold 36px Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(member.displayName || user.username, 240, 100);

  // About me
  ctx.font = FONT_FAMILY_REGULAR;
  ctx.fillStyle = '#B9BBBE';
  ctx.fillText('About Me:', 240, 150);
  wrapText(ctx, userData?.about || 'No information set yet.', 240, 180, 500, 25);


  // Stats
  const studyTime = formatTime(studyData?.total_minutes);
  const joinedDate = `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`;

  ctx.font = FONT_FAMILY_BOLD;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Total Study Time', 50, 300);
  ctx.fillText('Joined Server', 400, 300);

  ctx.font = FONT_FAMILY_REGULAR;
  ctx.fillStyle = '#B9BBBE';
  ctx.fillText(studyTime, 50, 340);
  ctx.fillText(joinedDate, 400, 340);


  return canvas.toBuffer();
}

async function generateStatsCard(user, stats) {
  const width = 600;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#23272A');
  gradient.addColorStop(1, '#2C2F33');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Card
  ctx.fillStyle = '#1c1e21';
  ctx.roundRect(20, 20, width - 40, height - 40, 20);
  ctx.fill();
  ctx.strokeStyle = '#5865F2';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Avatar
  const avatarURL = user.displayAvatarURL({ extension: 'png', size: 128 });
  const avatar = await loadImage(avatarURL);
  drawRoundedImage(ctx, avatar, 40, 70, 100, 100, 20);


  // Username
  ctx.font = 'bold 32px Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(user.username, 160, 90);

  // Total Time
  ctx.font = FONT_FAMILY_BOLD;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Total Study Time', 160, 150);
  ctx.font = FONT_FAMILY_REGULAR;
  ctx.fillStyle = '#B9BBBE';
  ctx.fillText(formatTime(stats?.total_minutes), 160, 180);

  // Last Updated
  ctx.font = FONT_FAMILY_BOLD;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Last Session', 160, 230);
  ctx.font = FONT_FAMILY_REGULAR;
  ctx.fillStyle = '#B9BBBE';
  ctx.fillText(
    stats?.last_update ? new Date(stats.last_update).toLocaleString() : 'Never',
    160,
    260
  );

  return canvas.toBuffer();
}

module.exports = { generateProfileCard, generateStatsCard }; 