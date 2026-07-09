import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'public', 'dailybrief-icon.jpg');
const outputDir = path.join(__dirname, 'public');

async function generateFavicons() {
  // favicon-32x32.png - standard browser favicon
  await sharp(inputFile).resize(32, 32).png().toFile(path.join(outputDir, 'favicon-32.png'));
  await sharp(inputFile).resize(16, 16).png().toFile(path.join(outputDir, 'favicon-16.png'));
  await sharp(inputFile).resize(192, 192).png().toFile(path.join(outputDir, 'favicon-192.png'));
  await sharp(inputFile).resize(180, 180).png().toFile(path.join(outputDir, 'apple-touch-icon.png'));
  await sharp(inputFile).resize(256, 256).png().toFile(path.join(outputDir, 'favicon.png'));

  console.log('All favicons generated successfully.');
}

generateFavicons().catch(console.error);
