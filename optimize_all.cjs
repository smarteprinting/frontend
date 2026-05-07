const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeLargeImages() {
  const publicDir = path.join(__dirname, 'public');
  const files = fs.readdirSync(publicDir);

  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
      const filePath = path.join(publicDir, file);
      const stats = fs.statSync(filePath);
      const sizeMB = stats.size / (1024 * 1024);

      if (sizeMB > 0.5) { // If larger than 500KB
        const tempPath = path.join(publicDir, `temp_${file}`);
        try {
          console.log(`Optimizing ${file} (${sizeMB.toFixed(2)} MB)...`);
          
          await sharp(filePath)
            // Just resize width to max 1200 if it's larger
            .resize(1200, null, { withoutEnlargement: true })
            .png({ compressionLevel: 9, adaptiveFiltering: true, force: false }) // use png for pngs
            .jpeg({ quality: 80, force: false }) // use jpeg for jpegs
            .toFile(tempPath);

          fs.renameSync(tempPath, filePath);
          console.log(`Successfully optimized ${file}`);
        } catch (err) {
          console.error(`Error optimizing ${file}:`, err);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      }
    }
  }
}

optimizeLargeImages();
