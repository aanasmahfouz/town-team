const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
const files = fs.readdirSync(assetsDir);

console.log('Optimizing images in:', assetsDir);

const imageExtensions = ['.jpg', '.jpeg', '.jfif', '.png'];

files.forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (imageExtensions.includes(ext)) {
    const inputPath = path.join(assetsDir, file);
    const baseName = path.basename(file, ext);
    const webpPath = path.join(assetsDir, `${baseName}.webp`);

    const statsBefore = fs.statSync(inputPath);
    if (statsBefore.size < 30000 && ext === '.png' && file.includes('logo')) {
      console.log(`Skipping small icon/logo: ${file}`);
      return;
    }

    try {
      // 1. Generate WebP version
      const scaleArg = (file.startsWith('gap') || file.includes('logo')) 
        ? `-vf "scale='min(800,iw)':-1"` 
        : `-vf "scale='min(1440,iw)':-1"`;

      execSync(`ffmpeg -y -i "${inputPath}" ${scaleArg} -q:v 80 "${webpPath}"`, { stdio: 'ignore' });
      const webpStats = fs.statSync(webpPath);
      console.log(`✓ Created ${baseName}.webp: ${(statsBefore.size / 1024).toFixed(1)}KB -> ${(webpStats.size / 1024).toFixed(1)}KB`);

      // 2. Also optimize original file in-place so existing references get smaller
      const tempPath = path.join(assetsDir, `temp_${file}`);
      if (ext === '.png') {
        execSync(`ffmpeg -y -i "${inputPath}" ${scaleArg} "${tempPath}"`, { stdio: 'ignore' });
      } else {
        execSync(`ffmpeg -y -i "${inputPath}" ${scaleArg} -q:v 2 "${tempPath}"`, { stdio: 'ignore' });
      }
      if (fs.existsSync(tempPath)) {
        const tempStats = fs.statSync(tempPath);
        if (tempStats.size < statsBefore.size) {
          fs.copyFileSync(tempPath, inputPath);
          console.log(`  Optimized original ${file}: ${(tempStats.size / 1024).toFixed(1)}KB`);
        }
        fs.unlinkSync(tempPath);
      }
    } catch (err) {
      console.error(`Failed to process ${file}:`, err.message);
    }
  }
});

console.log('Image optimization complete!');
